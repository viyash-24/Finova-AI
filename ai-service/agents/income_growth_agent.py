from typing import Dict, Any, List
import json
import logging
from langchain_core.prompts import PromptTemplate
from gemini.gemini_client import get_fast_llm

logger = logging.getLogger("finova.agents")

class IncomeGrowthAgent:
    def __init__(self):
        self.llm = get_fast_llm()
        
    def process(self, query: str, context: Dict[str, Any]) -> str:
        prompt = PromptTemplate(
            template="""You are an expert Income Growth AI.
Help the user identify ways to increase their income, suggest freelancing, recommend side hustles, and offer skill monetization ideas.
User Query: {query}
Context Data: {context}

Provide creative, practical, and personalized advice on how they can increase their earning potential based on their context.
""",
            input_variables=["query", "context"]
        )
        chain = prompt | self.llm
        try:
            return chain.invoke({"query": query, "context": str(context)}).content
        except Exception as e:
            logger.error(f"IncomeGrowthAgent.process error: {e}")
            return "I couldn't generate income growth ideas right now. Please try again."

    def analyze(self, context: Dict[str, Any]) -> Dict[str, Any]:
        prompt = PromptTemplate(
            template="""You are an expert Income Growth AI.
Based on the provided financial context (current income sources), generate a brief summary of their income diversity and provide exactly 1-2 actionable recommendations for side hustles or income growth.
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
            logger.error(f"IncomeGrowthAgent.analyze error: {e}")
            return {"summary": "Unable to analyze income.", "recommendations": []}
