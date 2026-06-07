from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.user import User
from app.services.budget_service import BudgetService

router = APIRouter()


@router.get("/")
async def read_budgets(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Return all budgets for the current user.
    Note: No budgets table exists in the current DB — returns an empty list."""
    return await BudgetService.get_all(db, current_user.id)


@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_budget(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return {"message": "Budget feature not yet implemented"}


@router.delete("/{budget_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_budget(
    budget_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    deleted = await BudgetService.delete(db, budget_id, current_user.id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Budget not found")
