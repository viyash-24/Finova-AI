from pydantic import BaseModel
from typing import Optional

class GoalCreate(BaseModel):
    name: str
    target: float
    current: Optional[float] = 0.0
    deadline: str
    icon: Optional[str] = "shield"

class GoalResponse(BaseModel):
    id: str
    name: str
    target: float
    current: float
    deadline: str
    icon: str

    class Config:
        from_attributes = True
