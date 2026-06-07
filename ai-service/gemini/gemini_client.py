import os
from langchain_google_genai import ChatGoogleGenerativeAI

def _get_api_key() -> str:
    """Read GOOGLE_API_KEY or GEMINI_API_KEY — accepts either env var name."""
    return (
        os.getenv("GOOGLE_API_KEY")
        or os.getenv("GEMINI_API_KEY")
        or "dummy_key"
    )

def get_llm():
    """Get the Gemini Pro LLM instance."""
    return ChatGoogleGenerativeAI(
        model="gemini-2.5-pro",
        temperature=0.7,
        google_api_key=_get_api_key(),
        max_output_tokens=2048,
    )

def get_fast_llm():
    """Get the Gemini Flash LLM instance for faster, simpler tasks."""
    return ChatGoogleGenerativeAI(
        model="gemini-2.5-flash",
        temperature=0.3,
        google_api_key=_get_api_key(),
        max_output_tokens=1024,
    )
