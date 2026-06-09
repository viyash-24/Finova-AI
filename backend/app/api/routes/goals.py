from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, asc
from typing import List
from datetime import datetime

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.user import User
from app.models.goal import Goal
from app.schemas.goal_schema import GoalCreate, GoalResponse

router = APIRouter()

@router.get("/", response_model=List[GoalResponse])
async def get_goals(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = select(Goal).filter(Goal.user_id == current_user.id).order_by(asc(Goal.created_at))
    result = await db.execute(query)
    results = result.scalars().all()
    
    return [
        GoalResponse(
            id=str(r.id),
            name=r.title,
            target=r.target_amount,
            current=r.current_amount,
            deadline=r.est_date.strftime("%b %Y") if r.est_date else "Dec 2026",
            icon=r.icon or "shield"
        )
        for r in results
    ]

@router.post("/", response_model=GoalResponse, status_code=status.HTTP_201_CREATED)
async def add_goal(
    payload: GoalCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    try:
        parsed_est = datetime.strptime(payload.deadline, "%Y-%m-%d").date()
    except Exception:
        try:
            parsed_est = datetime.strptime(f"01 {payload.deadline}", "%d %b %Y").date()
        except Exception:
            parsed_est = datetime(2026, 12, 31).date()
            
    new_goal = Goal(
        user_id=current_user.id,
        title=payload.name,
        target_amount=float(payload.target),
        current_amount=float(payload.current) if payload.current else 0.0,
        est_date=parsed_est,
        status="active",
        icon=payload.icon or "shield"
    )
    
    db.add(new_goal)
    await db.commit()
    await db.refresh(new_goal)
    
    return GoalResponse(
        id=str(new_goal.id),
        name=new_goal.title,
        target=new_goal.target_amount,
        current=new_goal.current_amount,
        deadline=new_goal.est_date.strftime("%b %Y") if new_goal.est_date else "Dec 2026",
        icon=new_goal.icon or "shield"
    )

@router.delete("/{goal_id}")
async def delete_goal(
    goal_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    result = await db.execute(select(Goal).filter(Goal.id == goal_id, Goal.user_id == current_user.id))
    goal = result.scalars().first()
    
    if not goal:
        raise HTTPException(status_code=404, detail="Goal not found")
        
    await db.delete(goal)
    await db.commit()
    return {"message": "Goal deleted"}
