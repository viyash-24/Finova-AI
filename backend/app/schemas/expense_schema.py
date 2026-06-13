from pydantic import BaseModel
from typing import Optional

class ExpenseCreate(BaseModel):
    description: str
    category: str
    amount: float
    date: str

class ExpenseResponse(BaseModel):
    id: str
    description: str
    category: str
    date: str
    amount: float

    class Config:
        from_attributes = True
