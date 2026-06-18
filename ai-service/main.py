import os
import time
import hashlib
import json
import asyncio
import logging
from concurrent.futures import ThreadPoolExecutor
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, Any, List
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure logging so agent errors are visible
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("finova.agents")

# Agents
from agents.expense_analysis_agent import ExpenseAnalysisAgent
from agents.savings_planner_agent import SavingsPlannerAgent
from agents.investment_suggestion_agent import InvestmentSuggestionAgent
from agents.bill_reminder_agent import BillReminderAgent
from agents.income_growth_agent import IncomeGrowthAgent
from agents.coordinator_agent import CoordinatorAgent

app = FastAPI(title="Finova AI Service", version="1.0.0")

# Allow the backend to call us
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class AIRequest(BaseModel):
    query: str
    context: Dict[str, Any] = {}

class AnalyzeRequest(BaseModel):
    query: str = ""
    context: Dict[str, Any] = {}

# Initialize Agents
coordinator = CoordinatorAgent()
expense_agent = ExpenseAnalysisAgent()
savings_agent = SavingsPlannerAgent()
investment_agent = InvestmentSuggestionAgent()
bill_agent = BillReminderAgent()
income_agent = IncomeGrowthAgent()

# Thread pool for running sync LangChain calls without blocking the event loop
# Use more workers so parallel agent calls don't queue up
_executor = ThreadPoolExecutor(max_workers=10)


def _run_in_thread(fn, *args):
    """Run a synchronous function in a thread pool and return an awaitable."""
    loop = asyncio.get_event_loop()
    return loop.run_in_executor(_executor, fn, *args)


# ─────────────────────────────────────────────────────
#  Simple in-memory cache with TTL
#  Prevents repeated page refreshes from burning API quota.
# ─────────────────────────────────────────────────────
_cache: Dict[str, Dict[str, Any]] = {}
CACHE_TTL_SECONDS = 1800  # 30 minutes — financial data changes infrequently


def _cache_key(prefix: str, data: Any) -> str:
    """Create a cache key from a prefix and context data."""
    raw = json.dumps(data, sort_keys=True, default=str)
    h = hashlib.md5(raw.encode()).hexdigest()[:12]
    return f"{prefix}:{h}"


def _cache_get(key: str) -> Any:
    """Return cached value if it exists and hasn't expired, else None."""
    entry = _cache.get(key)
    if entry and (time.time() - entry["ts"]) < CACHE_TTL_SECONDS:
        logger.info(f"Cache HIT: {key}")
        return entry["value"]
    return None


def _cache_set(key: str, value: Any) -> None:
    """Store a value in the cache."""
    _cache[key] = {"ts": time.time(), "value": value}
    # Evict old entries if cache grows too large
    if len(_cache) > 500:
        oldest_key = min(_cache, key=lambda k: _cache[k]["ts"])
        del _cache[oldest_key]


# ─────────────────────────────────────────────────────
#  Endpoints
# ─────────────────────────────────────────────────────

@app.post("/chat")
async def chat_endpoint(request: AIRequest):
    try:
        # Determine intent asynchronously
        intent = await _run_in_thread(coordinator.determine_intent, request.query)

        if intent == "expense":
            reply = await _run_in_thread(expense_agent.process, request.query, request.context)
        elif intent == "savings":
            reply = await _run_in_thread(savings_agent.process, request.query, request.context)
        elif intent == "investment":
            reply = await _run_in_thread(investment_agent.process, request.query, request.context)
        elif intent == "bills":
            reply = await _run_in_thread(bill_agent.process, request.query, request.context)
        elif intent == "income":
            reply = await _run_in_thread(income_agent.process, request.query, request.context)
        else:
            reply = await _run_in_thread(coordinator.general_chat, request.query, request.context)

        return {"reply": reply}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/analyze")
async def analyze_endpoint(request: AnalyzeRequest):
    ck = _cache_key("analyze", request.context)
    cached = _cache_get(ck)
    if cached:
        return cached

    try:
        # Run ALL agents in PARALLEL — eliminates 8+ s of sequential delays
        (
            expense_analysis,
            savings_analysis,
            investment_analysis,
            bill_analysis,
            income_analysis,
        ) = await asyncio.gather(
            _run_in_thread(expense_agent.analyze, request.context),
            _run_in_thread(savings_agent.analyze, request.context),
            _run_in_thread(investment_agent.analyze, request.context),
            _run_in_thread(bill_agent.analyze, request.context),
            _run_in_thread(income_agent.analyze, request.context),
            return_exceptions=False,
        )

        # Aggregate recommendations
        recommendations = (
            expense_analysis.get("recommendations", []) +
            savings_analysis.get("recommendations", []) +
            investment_analysis.get("recommendations", []) +
            bill_analysis.get("recommendations", []) +
            income_analysis.get("recommendations", [])
        )

        summary = (
            f"**Expense Insights:** {expense_analysis.get('summary', '')}\n\n"
            f"**Savings Plan:** {savings_analysis.get('summary', '')}\n\n"
            f"**Investment Opportunities:** {investment_analysis.get('summary', '')}\n\n"
            f"**Bill Reminders:** {bill_analysis.get('summary', '')}\n\n"
            f"**Income Growth:** {income_analysis.get('summary', '')}"
        )

        result = {
            "analysis": summary,
            "recommendations": recommendations[:5]  # Top 5 recommendations
        }
        if "Unable to analyze" not in summary:
            _cache_set(ck, result)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ──────────────────────────────────────────────
#  Agent-specific endpoints for page integration
# ──────────────────────────────────────────────

@app.post("/agent/expense")
async def expense_agent_endpoint(request: AnalyzeRequest):
    """Expense Analysis Agent — used by the Analytics page."""
    ck = _cache_key("agent_expense", request.context)
    cached = _cache_get(ck)
    if cached:
        return cached
    try:
        result = await _run_in_thread(expense_agent.analyze, request.context)
        if "Unable to analyze" not in result.get("summary", ""):
            _cache_set(ck, result)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/agent/savings")
async def savings_agent_endpoint(request: AnalyzeRequest):
    """Savings Planner Agent — used by the Goals page."""
    ck = _cache_key("agent_savings", request.context)
    cached = _cache_get(ck)
    if cached:
        return cached
    try:
        result = await _run_in_thread(savings_agent.analyze, request.context)
        if "Unable to analyze" not in result.get("summary", ""):
            _cache_set(ck, result)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/agent/bills")
async def bills_agent_endpoint(request: AnalyzeRequest):
    """Bill Reminder Agent — used by the Bills page."""
    ck = _cache_key("agent_bills", request.context)
    cached = _cache_get(ck)
    if cached:
        return cached
    try:
        result = await _run_in_thread(bill_agent.analyze, request.context)
        if "Unable to analyze" not in result.get("summary", ""):
            _cache_set(ck, result)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/agent/dashboard-summary")
async def dashboard_summary_endpoint(request: AnalyzeRequest):
    """Quick summary from Expense + Savings agents — used by the Dashboard page."""
    ck = _cache_key("agent_dashboard", request.context)
    cached = _cache_get(ck)
    if cached:
        return cached
    try:
        # Run BOTH agents in PARALLEL — saves the 3 s sequential sleep
        expense_analysis, savings_analysis = await asyncio.gather(
            _run_in_thread(expense_agent.analyze, request.context),
            _run_in_thread(savings_agent.analyze, request.context),
        )

        recommendations = (
            expense_analysis.get("recommendations", []) +
            savings_analysis.get("recommendations", [])
        )

        summary = (
            f"**Spending:** {expense_analysis.get('summary', '')}\n\n"
            f"**Savings:** {savings_analysis.get('summary', '')}"
        )

        result = {
            "summary": summary,
            "recommendations": recommendations[:3]
        }

        if "Unable to analyze" not in expense_analysis.get("summary", "") and "Unable to analyze" not in savings_analysis.get("summary", ""):
            _cache_set(ck, result)

        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/health")
async def health_check():
    return {"status": "healthy"}


@app.post("/cache/clear")
async def clear_cache():
    """Admin endpoint to manually clear the response cache."""
    _cache.clear()
    return {"status": "cache cleared"}
