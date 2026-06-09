from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, asc, desc
from typing import List
from pydantic import BaseModel

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.user import User
from app.models.ai_insight import AIInsight
from app.models.expense import Expense
from app.models.goal import Goal
from app.models.bill import Bill
from app.models.income import Income
from app.services.ai_service import AIService

router = APIRouter()


class InsightResponse(BaseModel):
    id: str
    title: str
    description: str
    icon: str


async def _build_context_for_insights(db: AsyncSession, user_id: int) -> dict:
    """Build lightweight financial context for insight generation."""
    exp_result = await db.execute(
        select(Expense).filter(Expense.user_id == user_id).order_by(desc(Expense.date)).limit(30)
    )
    expenses = exp_result.scalars().all()
    cat_map: dict = {}
    for e in expenses:
        cat_map[e.category] = cat_map.get(e.category, 0.0) + e.amount

    inc_result = await db.execute(select(Income).filter(Income.user_id == user_id))
    incomes = inc_result.scalars().all()
    total_income = sum(i.amount for i in incomes)
    total_expenses = sum(e.amount for e in expenses)

    goal_result = await db.execute(select(Goal).filter(Goal.user_id == user_id))
    goals = goal_result.scalars().all()

    bill_result = await db.execute(
        select(Bill).filter(Bill.user_id == user_id, Bill.status == "upcoming")
    )
    upcoming_bills = bill_result.scalars().all()

    return {
        "currency": "LKR",
        "total_income": total_income,
        "total_expenses": total_expenses,
        "expense_category_breakdown": cat_map,
        "goals": [{"name": g.title, "target": g.target_amount, "current": g.current_amount} for g in goals],
        "upcoming_bills": [{"name": b.name, "amount": b.amount, "due": str(b.due_date)} for b in upcoming_bills],
    }


async def _generate_and_save_insights(db: AsyncSession, user_id: int) -> List[AIInsight]:
    """Call the AI service, parse top recommendations, and persist them as AIInsight rows."""
    context = await _build_context_for_insights(db, user_id)
    result = await AIService.analyze("", context)

    recommendations: List[str] = result.get("recommendations", [])
    analysis_summary: str = result.get("analysis", "")

    # Delete stale insights for this user
    stale = await db.execute(select(AIInsight).filter(AIInsight.user_id == user_id))
    for old in stale.scalars().all():
        await db.delete(old)

    # Map recommendation index to a sensible icon
    icon_cycle = ["auto_awesome", "restaurant", "local_taxi", "savings", "trending_up"]

    new_insights: List[AIInsight] = []

    # If we got per-agent recommendations, save each one
    for idx, rec in enumerate(recommendations[:5]):
        insight = AIInsight(
            user_id=user_id,
            category="general",
            severity="info",
            title=rec[:80] if len(rec) > 80 else rec,
            description=rec,
            icon=icon_cycle[idx % len(icon_cycle)],
        )
        db.add(insight)
        new_insights.append(insight)

    # If no recommendations at all (e.g. AI service down), save a placeholder
    if not new_insights and not analysis_summary:
        insight = AIInsight(
            user_id=user_id,
            category="general",
            severity="info",
            title="AI service is temporarily unavailable",
            description="The AI analysis service is currently unavailable. Please try again later.",
            icon="auto_awesome",
        )
        db.add(insight)
        new_insights.append(insight)

    # If no recommendations, fall back to the summary block
    if not new_insights and analysis_summary:
        # Split the markdown summary into per-agent blocks
        blocks = [b.strip() for b in analysis_summary.split("\n\n") if b.strip()]
        icons = ["auto_awesome", "savings", "trending_up", "receipt_long", "payments"]
        for idx, block in enumerate(blocks[:5]):
            lines = block.splitlines()
            title = lines[0].replace("**", "").strip(" :")
            desc = " ".join(lines[1:]).strip() if len(lines) > 1 else title
            insight = AIInsight(
                user_id=user_id,
                category="general",
                severity="info",
                title=title[:80],
                description=desc[:500] if desc else title,
                icon=icons[idx % len(icons)],
            )
            db.add(insight)
            new_insights.append(insight)

    await db.commit()

    # Refresh objects
    refreshed = await db.execute(
        select(AIInsight).filter(AIInsight.user_id == user_id).order_by(asc(AIInsight.created_at))
    )
    return refreshed.scalars().all()


@router.get("/insights", response_model=List[InsightResponse])
async def get_insights(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(
        select(AIInsight)
        .filter(AIInsight.user_id == current_user.id)
        .order_by(asc(AIInsight.created_at))
    )
    insights = result.scalars().all()

    # Auto-generate on first load if none exist
    if not insights:
        insights = await _generate_and_save_insights(db, current_user.id)

    return [
        InsightResponse(id=str(r.id), title=r.title, description=r.description or "", icon=r.icon or "auto_awesome")
        for r in insights
    ]


@router.post("/insights/rerun", response_model=List[InsightResponse])
async def rerun_insights(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Force re-run all 5 AI agents and regenerate insights."""
    insights = await _generate_and_save_insights(db, current_user.id)
    return [
        InsightResponse(id=str(r.id), title=r.title, description=r.description or "", icon=r.icon or "auto_awesome")
        for r in insights
    ]
