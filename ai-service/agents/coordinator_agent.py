from typing import Dict, Any
from langchain_core.prompts import PromptTemplate
from gemini.gemini_client import get_fast_llm, extract_text


class CoordinatorAgent:
    def __init__(self):
        self.llm = get_fast_llm()

    def determine_intent(self, query: str) -> str:
        """Determines which agent should handle the query."""
        prompt = PromptTemplate(
            template="""You are a routing agent for a personal finance app.
Classify the following user query into exactly one of these categories:
- expense (for spending, expenses, budget limits, categories)
- savings (for goals, saving money, saving plans)
- investment (for investing, stocks, crypto, growth opportunities)
- bills (for reminders, due dates, subscriptions, paying bills)
- income (for side hustles, freelancing, increasing salary, earning more)
- general (for anything else or general greetings)

Query: {query}
Category:""",
            input_variables=["query"]
        )

        chain = prompt | self.llm
        try:
            result = chain.invoke({"query": query})
            category = extract_text(result.content).strip().lower()

            valid_categories = ["expense", "savings", "investment", "bills", "income", "general"]
            for valid in valid_categories:
                if valid in category:
                    return valid
            return "general"
        except Exception:
            return "general"

    def general_chat(self, query: str, context: Dict[str, Any]) -> str:
        prompt = PromptTemplate(
            template="""You are Finova, a helpful AI personal finance assistant.
Answer the user's query thoughtfully.
User Query: {query}
Context Data: {context}

Response:""",
            input_variables=["query", "context"]
        )
        chain = prompt | self.llm
        try:
            result = chain.invoke({"query": query, "context": str(context)})
            return extract_text(result.content)
        except Exception:
            return "I'm having trouble processing that request right now."
