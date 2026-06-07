from typing import Dict, Any, List
import json
import logging
from langchain_core.prompts import PromptTemplate
from gemini.gemini_client import get_fast_llm

logger = logging.getLogger("finova.agents")

class ExpenseAnalysisAgent:
    def __init__(self):
        self.llm = get_fast_llm()
        
    def process(self, query: str, context: Dict[str, Any]) -> str:
        prompt = PromptTemplate(
            template="""You are an expert Expense Analysis AI. 
Analyze the user's spending trends, budget data, and answer their query.
User Query: {query}
Expense & Financial Context: {context}

Provide a helpful, data-driven response highlighting spending trends, overspending alerts, and category analysis if relevant.
""",
            input_variables=["query", "context"]
        )
        chain = prompt | self.llm
        try:
            return chain.invoke({"query": query, "context": str(context)}).content
        except Exception as e:
            logger.error(f"ExpenseAnalysisAgent.process error: {e}")
            return "I couldn't analyze your expenses right now. Please try again."

    def analyze(self, context: Dict[str, Any]) -> Dict[str, Any]:
        prompt = PromptTemplate(
            template="""You are an expert Expense Analysis AI.
Based on the provided financial context, generate a brief summary of their spending habits and provide exactly 1-2 actionable recommendations (e.g., "Cut dining out by 10%").
Format your output EXACTLY as valid JSON with two keys: "summary" (string) and "recommendations" (list of strings).
Context: {context}
""",
            input_variables=["context"]
        )
        chain = prompt | self.llm
        try:
            result = chain.invoke({"context": str(context)}).content
            # Try to parse JSON from the response (removing markdown blocks if present)
            clean_result = result.replace("```json", "").replace("```", "").strip()
            return json.loads(clean_result)
        except Exception as e:
            logger.error(f"ExpenseAnalysisAgent.analyze error: {e}")
            return {"summary": "Unable to analyze expenses.", "recommendations": []}
