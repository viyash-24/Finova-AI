from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc
from typing import List, Optional
from datetime import datetime

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.user import User
from app.models.expense import Expense
from app.schemas.expense_schema import ExpenseCreate, ExpenseResponse

router = APIRouter()

@router.get("/", response_model=List[ExpenseResponse])
async def get_expenses(
    search: Optional[str] = Query(None),
    category: Optional[str] = Query(None),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = select(Expense).filter(Expense.user_id == current_user.id)
    
    if search:
        query = query.filter(Expense.merchant.ilike(f"%{search}%"))
        
    if category and category != "All categories":
        query = query.filter(Expense.category == category)
        
    query = query.order_by(desc(Expense.date), desc(Expense.id))
    
    result = await db.execute(query)
    results = result.scalars().all()
    
    return [
        ExpenseResponse(
            id=str(r.id),
            description=r.merchant or "",
            category=r.category or "",
            date=r.date.isoformat() if r.date else "",
            amount=r.amount
        )
        for r in results
    ]

@router.post("/", response_model=ExpenseResponse, status_code=status.HTTP_201_CREATED)
async def add_expense(
    payload: ExpenseCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    try:
        parsed_date = datetime.strptime(payload.date, "%Y-%m-%d").date()
    except Exception:
        parsed_date = datetime.now().date()
        
    new_exp = Expense(
        user_id=current_user.id,
        merchant=payload.description,
        category=payload.category or "Food",
        amount=float(payload.amount),
        date=parsed_date
    )
    
    db.add(new_exp)
    await db.commit()
    await db.refresh(new_exp)
    
    return ExpenseResponse(
        id=str(new_exp.id),
        description=new_exp.merchant or "",
        category=new_exp.category or "",
        date=new_exp.date.isoformat() if new_exp.date else "",
        amount=new_exp.amount
    )

@router.delete("/{expense_id}")
async def delete_expense(
    expense_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    result = await db.execute(select(Expense).filter(Expense.id == expense_id, Expense.user_id == current_user.id))
    exp = result.scalars().first()
    
    if not exp:
        raise HTTPException(status_code=404, detail="Expense not found")
        
    await db.delete(exp)
    await db.commit()
    return {"message": "Expense deleted"}
