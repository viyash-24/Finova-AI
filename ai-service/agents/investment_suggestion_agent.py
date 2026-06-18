from typing import Dict, Any
import logging
from langchain_core.prompts import PromptTemplate
from gemini.gemini_client import call_with_fallback, get_fast_llm, extract_text
from utils.json_parser import safe_agent_response

logger = logging.getLogger("finova.agents")

_ANALYZE_TEMPLATE = """You are an expert Investment Suggestion AI.
Based on the provided financial context, generate a brief summary of the user's investment readiness.
Provide exactly 1-2 actionable investment recommendations or educational next steps.
Note that these are not professional financial advice.

You MUST respond with ONLY a valid JSON object — no markdown, no explanation, just JSON.
The JSON must have exactly these two keys:
- "summary": a string describing investment readiness
- "recommendations": an array of 1-2 short actionable strings

Context: {context}"""

_CHAT_TEMPLATE = """You are an expert Investment Suggestion AI.
Help the user analyze their risk level, recommend beginner investments, and suggest growth opportunities.
User Query: {query}
Context Data: {context}

Provide educational, risk-aware investment advice. Always include a disclaimer that this is not professional financial advice."""


class InvestmentSuggestionAgent:
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
            logger.error(f"InvestmentSuggestionAgent.process error: {e}")
            return "I couldn't analyze investment opportunities right now. Please try again."

    def analyze(self, context: Dict[str, Any]) -> Dict[str, Any]:
        prompt = PromptTemplate(template=_ANALYZE_TEMPLATE, input_variables=["context"])
        try:
            
            return safe_agent_response(result.content, "Unable to analyze investments.", "InvestmentSuggestionAgent")
        except Exception as e:
            logger.error(f"InvestmentSuggestionAgent.analyze error: {e}")
            return {"summary": "Unable to analyze investments.", "recommendations": []}
