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

# Keywords that indicate a quota / rate-limit error (case-insensitive check)
_RATE_LIMIT_SIGNALS = [
    "quota",
    "rate limit",
    "resource_exhausted",
    "429",
    "too many requests",
    "rateLimitExceeded",
]


def _is_rate_limit_error(exc: Exception) -> bool:
    """Return True if the exception looks like a quota/rate-limit error."""
    msg = str(exc).lower()
    return any(signal.lower() in msg for signal in _RATE_LIMIT_SIGNALS)


def _make_llm(model: str, temperature: float, max_output_tokens: int,
              json_mode: bool = False) -> ChatGoogleGenerativeAI:
    """Construct a ChatGoogleGenerativeAI instance for the given model."""
    kwargs: Dict[str, Any] = dict(
        model=model,
        temperature=temperature,
        google_api_key=_get_api_key(),
        max_output_tokens=max_output_tokens,
        max_retries=1,
    )
    if json_mode:
        kwargs["model_kwargs"] = {"response_mime_type": "application/json"}
    return ChatGoogleGenerativeAI(**kwargs)


def call_with_fallback(
    prompt_template,          # PromptTemplate instance
    invoke_kwargs: dict,      # Variables to pass to .invoke()
    temperature: float = 0.3,
    max_output_tokens: int = 1024,
    json_mode: bool = False,
) -> Any:
    """
    Invoke a LangChain prompt chain with automatic model fallback.

    Tries each model in _FALLBACK_MODELS in order. If a model responds with
    a rate-limit / quota error, it sleeps 2 s and switches to the next model.
    Raises the last exception if every model is exhausted.
    """
    last_exc: Optional[Exception] = None

    for idx, model_name in enumerate(_FALLBACK_MODELS):
        try:
            llm = _make_llm(model_name, temperature, max_output_tokens, json_mode)
            chain = prompt_template | llm
            result = chain.invoke(invoke_kwargs)
            if idx > 0:
                logger.info(f"Fallback succeeded with model: {model_name}")
            return result
        except Exception as exc:
            last_exc = exc
            if _is_rate_limit_error(exc):
                logger.warning(
                    f"Model {model_name} hit rate limit. "
                    f"Switching to next model... ({exc})"
                )
                time.sleep(2)
                continue
            # Non-rate-limit error — re-raise immediately
            raise

    raise last_exc  # All models exhausted

