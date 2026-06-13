from pydantic import BaseModel
from typing import List, Dict, Any

class CategoryAnalysis(BaseModel):
    category: str
    amount: float
    percentage: float

class MonthlyReport(BaseModel):
    month: str
    total_expenses: float
    total_savings: float
    category_analysis: List[CategoryAnalysis]
    financial_health_score: int
    recommendations: List[str]
