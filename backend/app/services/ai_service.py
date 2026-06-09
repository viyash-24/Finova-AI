import httpx
import logging
from typing import Dict, Any
from app.core.config import settings

logger = logging.getLogger("finova")

# Generous timeout — Gemini can be slow, analyze runs 5 agents in parallel
_TIMEOUT = 90.0


class AIService:
    @staticmethod
    async def chat(query: str, context: Dict[str, Any] = {}):
        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    f"{settings.AI_SERVICE_URL}/chat",
                    json={"query": query, "context": context},
                    timeout=_TIMEOUT
                )
                response.raise_for_status()
                return response.json()
        except Exception as e:
            logger.error(f"AI service chat error: {e} | URL: {settings.AI_SERVICE_URL}")
            return {
                "reply": "The AI analysis service is currently offline. "
                         "Please use the built-in chat at /api/chat for database-backed financial queries."
            }

    @staticmethod
    async def analyze(query: str, context: Dict[str, Any] = {}):
        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    f"{settings.AI_SERVICE_URL}/analyze",
                    json={"query": query, "context": context},
                    timeout=_TIMEOUT
                )
                response.raise_for_status()
                return response.json()
        except Exception as e:
            logger.error(f"AI service analyze error: {e} | URL: {settings.AI_SERVICE_URL}")
            return {
                "analysis": "AI analysis service is currently unavailable. Please try again later.",
                "recommendations": []
            }

    @staticmethod
    async def _call_agent(endpoint: str, context: Dict[str, Any], fallback_summary: str) -> Dict[str, Any]:
        """Generic helper to call a specific agent endpoint on the AI microservice."""
        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    f"{settings.AI_SERVICE_URL}/agent/{endpoint}",
                    json={"context": context},
                    timeout=_TIMEOUT
                )
                response.raise_for_status()
                return response.json()
        except Exception as e:
            logger.error(f"AI agent/{endpoint} error: {e}")
            return {"summary": fallback_summary, "recommendations": []}

    @staticmethod
    async def agent_expense(context: Dict[str, Any]) -> Dict[str, Any]:
        return await AIService._call_agent("expense", context, "Unable to analyze expenses right now.")

    @staticmethod
    async def agent_savings(context: Dict[str, Any]) -> Dict[str, Any]:
        return await AIService._call_agent("savings", context, "Unable to generate savings advice right now.")

    @staticmethod
    async def agent_bills(context: Dict[str, Any]) -> Dict[str, Any]:
        return await AIService._call_agent("bills", context, "Unable to analyze bills right now.")

    @staticmethod
    async def agent_dashboard_summary(context: Dict[str, Any]) -> Dict[str, Any]:
        return await AIService._call_agent("dashboard-summary", context, "Unable to generate summary right now.")
