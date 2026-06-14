from typing import Dict, Any
import logging
from langchain_core.prompts import PromptTemplate
from gemini.gemini_client import get_fast_llm, get_json_llm, extract_text
from utils.json_parser import safe_agent_response

logger = logging.getLogger("finova.agents")

_ANALYZE_TEMPLATE = """You are an expert Savings Planner AI.
Based on the provided financial context (goals, income, expenses), generate a brief summary of the user's savings progress.
Provide exactly 1-2 actionable recommendations to boost savings (e.g., "Set aside 15% of monthly income automatically").

You MUST respond with ONLY a valid JSON object — no markdown, no explanation, just JSON.
The JSON must have exactly these two keys:
- "summary": a string describing savings progress
- "recommendations": an array of 1-2 short actionable strings

Context: {context}"""

_CHAT_TEMPLATE = """You are an expert Savings Planner AI.
Help the user create budgets, recommend savings plans, and generate discipline strategies.
User Query: {query}
Context Data: {context}

Provide a thoughtful, structured response with actionable savings advice."""


class SavingsPlannerAgent:
    def __init__(self):
        self.llm = get_fast_llm()
        self.json_llm = get_json_llm()

    def process(self, query: str, context: Dict[str, Any]) -> str:
        prompt = PromptTemplate(template=_CHAT_TEMPLATE, input_variables=["query", "context"])
        chain = prompt | self.llm
        try:
            result = chain.invoke({"query": query, "context": str(context)})
            return extract_text(result.content)
        except Exception as e:
            logger.error(f"SavingsPlannerAgent.process error: {e}")
            return "I couldn't generate a savings plan right now. Please try again."

    def analyze(self, context: Dict[str, Any]) -> Dict[str, Any]:
        prompt = PromptTemplate(template=_ANALYZE_TEMPLATE, input_variables=["context"])
        chain = prompt | self.json_llm
        try:
            result = chain.invoke({"context": str(context)})
            return safe_agent_response(result.content, "Unable to analyze savings.", "SavingsPlannerAgent")
        except Exception as e:
            logger.error(f"SavingsPlannerAgent.analyze error: {e}")
            return {"summary": "Unable to analyze savings.", "recommendations": []}
