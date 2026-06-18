import os
import time
import logging
from typing import Any, Dict, Optional
from langchain_google_genai import ChatGoogleGenerativeAI

logger = logging.getLogger("finova.agents")


def _get_api_key() -> str:
    """Read GOOGLE_API_KEY or GEMINI_API_KEY — accepts either env var name."""
    return (
        os.getenv("GOOGLE_API_KEY")
        or os.getenv("GEMINI_API_KEY")
        or "dummy_key"
    )


def extract_text(content) -> str:
    """
    Normalize LLM response .content to a plain string.

    langchain-google-genai >=2.x may return content as a list of dicts:
      [{"type": "text", "text": "...", "extras": {...}}]
    Older versions return a plain string.
    This helper handles both formats transparently.
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


# ─────────────────────────────────────────────────────
#  Model fallback chain
#  When one model hits its rate/quota limit we automatically
#  retry the same prompt with the next model in the list.
# ─────────────────────────────────────────────────────

# Ordered list of model IDs to try. First = preferred (fastest/cheapest).
_FALLBACK_MODELS = [
    "gemini-2.0-flash",
    "gemini-1.5-flash",
    "gemini-1.5-flash-8b",
]
