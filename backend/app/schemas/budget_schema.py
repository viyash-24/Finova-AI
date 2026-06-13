# Budget schema stub — no 'budgets' table exists in the current database.
# Kept as a placeholder for future implementation.
from pydantic import BaseModel
from typing import Optional


class BudgetCreate(BaseModel):
    category: str = ""
    limit_amount: float = 0.0
    month: str = ""


class BudgetResponse(BaseModel):
    id: int = 0
    user_id: int = 0
    category: str = ""
    limit_amount: float = 0.0
    month: str = ""
