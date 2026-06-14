from typing import Dict, Any
import logging
from langchain_core.prompts import PromptTemplate
from gemini.gemini_client import get_fast_llm, get_json_llm, extract_text
from utils.json_parser import safe_agent_response

logger = logging.getLogger("finova.agents")

_ANALYZE_TEMPLATE = """You are an expert Bill Reminder AI.
Based on the provided financial context (specifically the bills list), generate a brief summary of the user's upcoming obligations.
Provide exactly 1-2 actionable recommendations (e.g., "Pay internet bill in 2 days to avoid late fees").

You MUST respond with ONLY a valid JSON object — no markdown, no explanation, just JSON.
The JSON must have exactly these two keys:
- "summary": a string describing upcoming bill obligations
- "recommendations": an array of 1-2 short actionable strings

Context: {context}"""

_CHAT_TEMPLATE = """You are an expert Bill Reminder AI.
Help the user track due dates, send reminders conceptually, and detect unpaid bills.
User Query: {query}
Context Data (bills list): {context}

Provide a helpful summary of upcoming due dates, highlight any overdue bills, and give advice on avoiding late fees."""


class BillReminderAgent:
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
            logger.error(f"BillReminderAgent.process error: {e}")
            return "I couldn't check your bills right now. Please try again."

    def analyze(self, context: Dict[str, Any]) -> Dict[str, Any]:
        prompt = PromptTemplate(template=_ANALYZE_TEMPLATE, input_variables=["context"])
        chain = prompt | self.json_llm
        try:
            result = chain.invoke({"context": str(context)})
            return safe_agent_response(result.content, "Unable to analyze bills.", "BillReminderAgent")
        except Exception as e:
            logger.error(f"BillReminderAgent.analyze error: {e}")
            return {"summary": "Unable to analyze bills.", "recommendations": []}
