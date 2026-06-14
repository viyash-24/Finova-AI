"""
Robust JSON extraction utility for AI agent responses.

Handles:
  - New langchain-google-genai v2 content format: list of dicts [{"type":"text","text":"..."}]
  - Old format: plain string
  - LLM output wrapping: pure JSON, markdown code blocks, or embedded JSON
"""

import json
import re
import logging
from typing import Dict, Any, Union, List

logger = logging.getLogger("finova.agents")


def extract_text(content: Union[str, list, Any]) -> str:
    """
    Normalize LLM response .content to a plain string.

    langchain-google-genai >=2.x returns content as a list of dicts:
      [{"type": "text", "text": "...", "extras": {...}}]
    Older versions return a plain string.
    """
    if isinstance(content, str):
        return content
    if isinstance(content, list):
        parts = []
        for item in content:
            if isinstance(item, dict) and "text" in item:
                parts.append(item["text"])
            elif isinstance(item, str):
                parts.append(item)
        return "".join(parts)
    return str(content)


def extract_json(raw: str) -> Dict[str, Any]:
    """
    Attempt to extract a JSON object from a raw LLM text string.
    Uses 3 fallback strategies.
    """
    if not raw or not raw.strip():
        raise ValueError("Empty response from LLM")

    # Strategy 1: Response is already clean JSON
    try:
        return json.loads(raw.strip())
    except json.JSONDecodeError:
        pass

    # Strategy 2: Extract from a markdown code block (```json ... ```)
    code_block_pattern = re.compile(
        r"```(?:json|JSON)?\s*\n?(.*?)\n?\s*```",
        re.DOTALL
    )
    match = code_block_pattern.search(raw)
    if match:
        try:
            return json.loads(match.group(1).strip())
        except json.JSONDecodeError:
            pass

    # Strategy 3: Find the first { ... } block in the raw string
    brace_pattern = re.compile(r"\{.*\}", re.DOTALL)
    match = brace_pattern.search(raw)
    if match:
        try:
            return json.loads(match.group(0).strip())
        except json.JSONDecodeError:
            pass

    raise ValueError(f"Could not extract valid JSON from LLM response: {raw[:200]}")


def safe_agent_response(
    content: Union[str, list, Any],
    fallback_summary: str,
    agent_name: str,
) -> Dict[str, Any]:
    """
    Accepts raw LLM .content (string or list), extracts text,
    parses JSON, validates keys, and returns a guaranteed dict.
    """
    try:
        raw = extract_text(content)
        result = extract_json(raw)

        if "summary" not in result:
            result["summary"] = fallback_summary
        if "recommendations" not in result:
            result["recommendations"] = []
        if not isinstance(result["recommendations"], list):
            result["recommendations"] = []

        return result
    except Exception as e:
        logger.error(f"{agent_name} parse error: {e} | Raw snippet: {str(content)[:200]}")
        return {"summary": fallback_summary, "recommendations": []}
