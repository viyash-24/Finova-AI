from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, asc
from typing import List
from datetime import datetime

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.user import User
from app.models.bill import Bill
from app.schemas.bill_schema import BillCreate, BillResponse

router = APIRouter()

@router.get("/", response_model=List[BillResponse])
async def get_bills(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = select(Bill).filter(Bill.user_id == current_user.id).order_by(asc(Bill.due_date))
    result = await db.execute(query)
    results = result.scalars().all()
    
    return [
        BillResponse(
            id=str(r.id),
            name=r.name,
            provider=r.provider or "",
            amount=r.amount,
            dueDate=r.due_date.strftime("%b %d") if r.due_date else "",
            status=r.status or "upcoming",
            icon=r.icon or "receipt"
        )
        for r in results
    ]

@router.post("/", response_model=BillResponse, status_code=status.HTTP_201_CREATED)
async def add_bill(
    payload: BillCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    try:
        parsed_due = datetime.strptime(payload.dueDate, "%Y-%m-%d").date()
    except Exception:
        try:
            # Fallback format for '2026 Aug 25' or similar if necessary
            parsed_due = datetime.strptime(f"2026 {payload.dueDate}", "%Y %b %d").date()
        except Exception:
            parsed_due = datetime(2026, 8, 25).date()
            
    new_bill = Bill(
        user_id=current_user.id,
        name=payload.name,
        category="Utilities",
        provider=payload.provider or "",
        amount=float(payload.amount),
        due_date=parsed_due,
        status="upcoming",
        icon=payload.icon or "receipt_long"
    )
    
    db.add(new_bill)
    await db.commit()
    await db.refresh(new_bill)
    
    return BillResponse(
        id=str(new_bill.id),
        name=new_bill.name,
        provider=new_bill.provider or "",
        amount=new_bill.amount,
        dueDate=new_bill.due_date.strftime("%b %d") if new_bill.due_date else "",
        status=new_bill.status or "upcoming",
        icon=new_bill.icon or "receipt_long"
    )

@router.delete("/{bill_id}")
async def delete_bill(
    bill_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    result = await db.execute(select(Bill).filter(Bill.id == bill_id, Bill.user_id == current_user.id))
    bill = result.scalars().first()
    
    if not bill:
        raise HTTPException(status_code=404, detail="Bill not found")
        
    await db.delete(bill)
    await db.commit()
    return {"message": "Bill deleted"}
