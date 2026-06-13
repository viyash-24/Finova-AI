from pydantic import BaseModel
from typing import Optional

class IncomeCreate(BaseModel):
    source: str
    amount: float
    type: str
    date: str
    note: Optional[str] = None

class IncomeResponse(BaseModel):
    id: str
    source: str
    amount: float
    type: str
    date: str
    note: Optional[str] = None

    class Config:
        from_attributes = True
