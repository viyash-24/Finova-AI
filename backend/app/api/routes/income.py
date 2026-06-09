from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc, func
from typing import List
from datetime import datetime

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.user import User
from app.models.income import Income
from app.schemas.income_schema import IncomeCreate, IncomeResponse

router = APIRouter()


@router.get("/", response_model=List[IncomeResponse])
async def get_incomes(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(
        select(Income)
        .filter(Income.user_id == current_user.id)
        .order_by(desc(Income.date), desc(Income.id))
    )
    rows = result.scalars().all()
    return [
        IncomeResponse(
            id=str(r.id),
            source=r.source,
            amount=r.amount,
            type=r.type,
            date=r.date.isoformat() if r.date else "",
            note=r.note,
        )
        for r in rows
    ]


@router.get("/total")
async def get_total_income(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(
        select(func.sum(Income.amount)).filter(Income.user_id == current_user.id)
    )
    total = result.scalar() or 0.0
    return {"total": total}


@router.post("/", response_model=IncomeResponse, status_code=status.HTTP_201_CREATED)
async def add_income(
    payload: IncomeCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    try:
        parsed_date = datetime.strptime(payload.date, "%Y-%m-%d").date()
    except Exception:
        parsed_date = datetime.now().date()

    new_income = Income(
        user_id=current_user.id,
        source=payload.source,
        amount=float(payload.amount),
        type=payload.type or "Other",
        date=parsed_date,
        note=payload.note,
    )
    db.add(new_income)
    await db.commit()
    await db.refresh(new_income)

    return IncomeResponse(
        id=str(new_income.id),
        source=new_income.source,
        amount=new_income.amount,
        type=new_income.type,
        date=new_income.date.isoformat() if new_income.date else "",
        note=new_income.note,
    )


@router.delete("/{income_id}")
async def delete_income(
    income_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(
        select(Income).filter(Income.id == income_id, Income.user_id == current_user.id)
    )
    row = result.scalars().first()
    if not row:
        raise HTTPException(status_code=404, detail="Income not found")
    await db.delete(row)
    await db.commit()
    return {"message": "Income deleted"}
