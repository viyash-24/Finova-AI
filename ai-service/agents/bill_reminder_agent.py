from typing import Dict, Any, List
import json
import logging
from langchain_core.prompts import PromptTemplate
from gemini.gemini_client import get_fast_llm

logger = logging.getLogger("finova.agents")

class BillReminderAgent:
    def __init__(self):
        self.llm = get_fast_llm()
        
    def process(self, query: str, context: Dict[str, Any]) -> str:
        prompt = PromptTemplate(
            template="""You are an expert Bill Reminder AI.
Help the user track due dates, send reminders conceptually, and detect unpaid bills.
User Query: {query}
Context Data (bills list): {context}

Provide a helpful summary of upcoming due dates, highlight any overdue bills, and give advice on avoiding late fees.
""",
            input_variables=["query", "context"]
        )
        chain = prompt | self.llm
        try:
            return chain.invoke({"query": query, "context": str(context)}).content
        except Exception as e:
            logger.error(f"BillReminderAgent.process error: {e}")
            return "I couldn't check your bills right now. Please try again."

    def analyze(self, context: Dict[str, Any]) -> Dict[str, Any]:
        prompt = PromptTemplate(
            template="""You are an expert Bill Reminder AI.
Based on the provided financial context (specifically the bills list), generate a brief summary of their upcoming obligations and provide exactly 1-2 actionable recommendations (e.g., "Pay internet bill in 2 days").
Format your output EXACTLY as valid JSON with two keys: "summary" (string) and "recommendations" (list of strings).
Context: {context}
""",
            input_variables=["context"]
        )
        chain = prompt | self.llm
        try:
            result = chain.invoke({"context": str(context)}).content
            clean_result = result.replace("```json", "").replace("```", "").strip()
            return json.loads(clean_result)
        except Exception as e:
            logger.error(f"BillReminderAgent.analyze error: {e}")
            return {"summary": "Unable to analyze bills.", "recommendations": []}
