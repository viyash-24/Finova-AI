from typing import Dict, Any
import logging
from langchain_core.prompts import PromptTemplate
from gemini.gemini_client import get_fast_llm, get_json_llm, extract_text
from utils.json_parser import safe_agent_response

logger = logging.getLogger("finova.agents")

_ANALYZE_TEMPLATE = """You are an expert Expense Analysis AI.
Based on the provided financial context, generate a brief summary of the user's spending habits.
Provide exactly 1-2 actionable recommendations (e.g., "Cut dining out by 10%").

You MUST respond with ONLY a valid JSON object — no markdown, no explanation, just JSON.
The JSON must have exactly these two keys:
- "summary": a string describing spending habits
- "recommendations": an array of 1-2 short actionable strings

Context: {context}"""

_CHAT_TEMPLATE = """You are an expert Expense Analysis AI.
Analyze the user's spending trends, budget data, and answer their query.
User Query: {query}
Expense & Financial Context: {context}

Provide a helpful, data-driven response highlighting spending trends, overspending alerts, and category analysis if relevant."""


class ExpenseAnalysisAgent:
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
            logger.error(f"ExpenseAnalysisAgent.process error: {e}")
            return "I couldn't analyze your expenses right now. Please try again."

    def analyze(self, context: Dict[str, Any]) -> Dict[str, Any]:
        prompt = PromptTemplate(template=_ANALYZE_TEMPLATE, input_variables=["context"])
        chain = prompt | self.json_llm
        try:
            result = chain.invoke({"context": str(context)})
            return safe_agent_response(result.content, "Unable to analyze expenses.", "ExpenseAnalysisAgent")
        except Exception as e:
            logger.error(f"ExpenseAnalysisAgent.analyze error: {e}")
            return {"summary": "Unable to analyze expenses.", "recommendations": []}
