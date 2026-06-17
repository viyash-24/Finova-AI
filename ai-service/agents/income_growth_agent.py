from typing import Dict, Any
import logging
from langchain_core.prompts import PromptTemplate
from gemini.gemini_client import call_with_fallback, get_fast_llm, extract_text
from utils.json_parser import safe_agent_response

logger = logging.getLogger("finova.agents")

_ANALYZE_TEMPLATE = """You are an expert Income Growth AI.
Based on the provided financial context (current income sources), generate a brief summary of the user's income diversity.
Provide exactly 1-2 actionable recommendations for side hustles or income growth.

You MUST respond with ONLY a valid JSON object — no markdown, no explanation, just JSON.
The JSON must have exactly these two keys:
- "summary": a string describing income diversity
- "recommendations": an array of 1-2 short actionable strings

Context: {context}"""

_CHAT_TEMPLATE = """You are an expert Income Growth AI.
Help the user identify ways to increase their income, suggest freelancing, recommend side hustles, and offer skill monetization ideas.
User Query: {query}
Context Data: {context}

Provide creative, practical, and personalized advice on how they can increase their earning potential based on their context."""


class IncomeGrowthAgent:
    def __init__(self):
        self.llm = get_fast_llm()

    def process(self, query: str, context: Dict[str, Any]) -> str:
        prompt = PromptTemplate(template=_CHAT_TEMPLATE, input_variables=["query", "context"])
        try:
            result = call_with_fallback(
                prompt,
                {"query": query, "context": str(context)},
                temperature=0.3,
                max_output_tokens=1024,
            )
            return extract_text(result.content)
        except Exception as e:
            logger.error(f"IncomeGrowthAgent.process error: {e}")
            return "I couldn't generate income growth ideas right now. Please try again."

    def analyze(self, context: Dict[str, Any]) -> Dict[str, Any]:
        prompt = PromptTemplate(template=_ANALYZE_TEMPLATE, input_variables=["context"])
        try:
          
            return safe_agent_response(result.content, "Unable to analyze income.", "IncomeGrowthAgent")
        except Exception as e:
            logger.error(f"IncomeGrowthAgent.analyze error: {e}")
            return {"summary": "Unable to analyze income.", "recommendations": []}
