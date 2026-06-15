import os
from langchain_google_genai import ChatGoogleGenerativeAI


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
#  Three different model names → three separate quotas
#  Each free-tier model gets its own 20 RPM allowance.
# ─────────────────────────────────────────────────────

def get_llm():
    """Primary LLM"""
    return ChatGoogleGenerativeAI(
        model="gemini-flash-latest",
        temperature=0.7,
        google_api_key=_get_api_key(),
        max_output_tokens=2048,
        max_retries=1,
    )


def get_fast_llm():
    """Fast LLM for routing & chat"""
    return ChatGoogleGenerativeAI(
        model="gemini-flash-latest",
        temperature=0.3,
        google_api_key=_get_api_key(),
        max_output_tokens=1024,
        max_retries=1,
    )


def get_json_llm():
    """JSON-focused LLM for analyze() calls"""
    return ChatGoogleGenerativeAI(
        model="gemini-flash-latest",
        temperature=0.1,
        google_api_key=_get_api_key(),
        max_output_tokens=1024,
        max_retries=2,
        model_kwargs={"response_mime_type": "application/json"}
    )
