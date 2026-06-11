from pydantic import BaseModel
from typing import Optional

class BillCreate(BaseModel):
    name: str
    provider: Optional[str] = ""
    amount: float
    dueDate: str
    icon: Optional[str] = "receipt_long"

class BillResponse(BaseModel):
    id: str
    name: str
    provider: str
    amount: float
    dueDate: str
    status: str
    icon: str

    class Config:
        from_attributes = True
