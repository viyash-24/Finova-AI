from fastapi import APIRouter, Depends
from pydantic import BaseModel
from typing import Dict, Any
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.user import User
from app.models.expense import Expense
from app.models.goal import Goal
from app.models.bill import Bill
from app.models.income import Income
from app.services.ai_service import AIService

router = APIRouter()


class AIRequest(BaseModel):
    query: str
    context: Dict[str, Any] = {}


async def _build_financial_context(db: AsyncSession, user: User) -> Dict[str, Any]:
    """Fetch all user financial data and return as structured context for AI agents."""

    # Expenses — last 20
    exp_result = await db.execute(
        select(Expense)
        .filter(Expense.user_id == user.id)
        .order_by(Expense.date.desc())
        .limit(20)
    )
    expenses = exp_result.scalars().all()
    expense_list = [
        {"description": e.merchant, "category": e.category, "amount": e.amount, "date": str(e.date)}
        for e in expenses
    ]
    total_expenses = sum(e.amount for e in expenses)

    # Category breakdown
    cat_map: Dict[str, float] = {}
    for e in expenses:
        cat_map[e.category] = cat_map.get(e.category, 0.0) + e.amount

    # Income
    inc_result = await db.execute(
        select(Income).filter(Income.user_id == user.id).order_by(Income.date.desc()).limit(10)
    )
    incomes = inc_result.scalars().all()
    income_list = [
        {"source": i.source, "type": i.type, "amount": i.amount, "date": str(i.date)}
        for i in incomes
    ]
    total_income = sum(i.amount for i in incomes)

    # Goals
    goal_result = await db.execute(select(Goal).filter(Goal.user_id == user.id))
    goals = goal_result.scalars().all()
    goal_list = [
        {"name": g.title, "target": g.target_amount, "current": g.current_amount, "deadline": str(g.est_date) if g.est_date else None}
        for g in goals
    ]

    # Bills
    bill_result = await db.execute(select(Bill).filter(Bill.user_id == user.id))
    bills = bill_result.scalars().all()
    bill_list = [
        {"name": b.name, "amount": b.amount, "due_date": str(b.due_date), "status": b.status}
        for b in bills
    ]
    upcoming_bills = [b for b in bills if b.status == "upcoming"]

    # Savings rate
    savings_rate = round(((total_income - total_expenses) / total_income * 100), 1) if total_income > 0 else 0

    return {
        "currency": "LKR (Sri Lankan Rupees)",
        "total_income": total_income,
        "total_expenses": total_expenses,
        "savings_rate_pct": savings_rate,
        "expense_category_breakdown": cat_map,
        "recent_expenses": expense_list,
        "income_sources": income_list,
        "savings_goals": goal_list,
        "bills": bill_list,
        "upcoming_bills_count": len(upcoming_bills),
    }


@router.post("/chat")
async def ai_chat(
    request: AIRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # Always build fresh financial context from DB — agents need real data
    context = await _build_financial_context(db, current_user)
    # Merge any extra context the client sent
    context.update(request.context)
    return await AIService.chat(request.query, context)


@router.post("/analyze")
async def ai_analyze(
    request: AIRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    context = await _build_financial_context(db, current_user)
    context.update(request.context)
    return await AIService.analyze(request.query, context)


# ──────────────────────────────────────────────
#  Page-specific agent endpoints
# ──────────────────────────────────────────────

@router.get("/agent/dashboard")
async def ai_dashboard_summary(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Dashboard — quick summary from Expense Analysis + Savings Planner agents."""
    context = await _build_financial_context(db, current_user)
    return await AIService.agent_dashboard_summary(context)


@router.get("/agent/analytics")
async def ai_analytics_insights(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Analytics — Expense Analysis Agent + Savings Planner Agent."""
    context = await _build_financial_context(db, current_user)

    import asyncio
    expense_result, savings_result = await asyncio.gather(
        AIService.agent_expense(context),
        AIService.agent_savings(context),
    )

    recommendations = (
        expense_result.get("recommendations", []) +
        savings_result.get("recommendations", [])
    )

    return {
        "expense": expense_result,
        "savings": savings_result,
        "recommendations": recommendations[:5],
    }


@router.get("/agent/goals")
async def ai_goals_advice(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Goals page — Savings Planner Agent."""
    context = await _build_financial_context(db, current_user)
    return await AIService.agent_savings(context)


@router.get("/agent/bills")
async def ai_bills_advice(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Bills page — Bill Reminder Agent."""
    context = await _build_financial_context(db, current_user)
    return await AIService.agent_bills(context)
