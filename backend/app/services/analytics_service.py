from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import func
from app.models.expense import Expense


class AnalyticsService:
    @staticmethod
    async def get_summary(db: AsyncSession, user_id: int):
        result = await db.execute(
            select(func.sum(Expense.amount)).filter(Expense.user_id == user_id)
        )
        total_expenses = result.scalar() or 0.0

        # Group by category
        category_result = await db.execute(
            select(Expense.category, func.sum(Expense.amount))
            .filter(Expense.user_id == user_id)
            .group_by(Expense.category)
        )
        category_breakdown = [
            {"category": row[0], "amount": row[1]}
            for row in category_result.all()
        ]

        return {
            "total_expenses": total_expenses,
            "category_breakdown": category_breakdown
        }
