from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List, Dict, Any
from pydantic import BaseModel
from datetime import datetime

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.user import User
from app.models.income import Income
from app.models.expense import Expense

router = APIRouter()

class CashFlowPoint(BaseModel):
    month: str
    income: float
    expenses: float

class DashboardResponse(BaseModel):
    income: float
    expenses: float
    savings: float
    healthScore: int
    cashFlow: List[CashFlowPoint]

@router.get("/", response_model=DashboardResponse)
async def get_dashboard_data(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Fetch real incomes and expenses
    incomes_result = await db.execute(select(Income).filter(Income.user_id == current_user.id))
    incomes = incomes_result.scalars().all()
    
    expenses_result = await db.execute(select(Expense).filter(Expense.user_id == current_user.id))
    expenses = expenses_result.scalars().all()

    # Group by month
    month_data = {}
    
    for i in incomes:
        if i.date:
            m = i.date.strftime("%b")
            if m not in month_data: month_data[m] = {"income": 0.0, "expenses": 0.0}
            month_data[m]["income"] += i.amount
            
    for e in expenses:
        if e.date:
            m = e.date.strftime("%b")
            if m not in month_data: month_data[m] = {"income": 0.0, "expenses": 0.0}
            month_data[m]["expenses"] += e.amount

    months_order = {'Jan': 1, 'Feb': 2, 'Mar': 3, 'Apr': 4, 'May': 5, 'Jun': 6, 'Jul': 7, 'Aug': 8, 'Sep': 9, 'Oct': 10, 'Nov': 11, 'Dec': 12}
    
    # Sort months chronologically
    sorted_months = sorted(month_data.keys(), key=lambda x: months_order.get(x, 13))
    
    cash_flow_response = [
        CashFlowPoint(month=m, income=month_data[m]["income"], expenses=month_data[m]["expenses"])
        for m in sorted_months
    ]
    
    # If no data exists, add current month empty to avoid blank graph
    if not cash_flow_response:
        current_month = datetime.now().strftime("%b")
        cash_flow_response = [CashFlowPoint(month=current_month, income=0.0, expenses=0.0)]
    
    total_inc = sum(i.amount for i in incomes)
    total_exp = sum(e.amount for e in expenses)
    total_sav = total_inc - total_exp
    
    # Basic Health Score calculation
    health = 0
    if total_inc > 0:
        sav_rate = total_sav / total_inc
        if sav_rate >= 0.2: health = 95
        elif sav_rate >= 0.1: health = 85
        elif sav_rate > 0: health = 70
        else: health = 45
    elif total_exp > 0:
        health = 30 # Only expenses, no income = poor health
    
    return DashboardResponse(
        income=total_inc,
        expenses=total_exp,
        savings=total_sav,
        healthScore=health,
        cashFlow=cash_flow_response
    )
