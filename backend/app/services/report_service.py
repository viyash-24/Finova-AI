from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import func, extract
from datetime import datetime
from app.models.expense import Expense
from app.models.goal import Goal
from app.schemas.report_schema import MonthlyReport, CategoryAnalysis


class ReportService:
    @staticmethod
    async def generate_monthly_report(db: AsyncSession, user_id: int, year: int, month: int) -> MonthlyReport:
        # 1. Total Expenses & Category Breakdown
        expenses_result = await db.execute(
            select(Expense.category, func.sum(Expense.amount))
            .filter(Expense.user_id == user_id)
            .filter(extract('year', Expense.date) == year)
            .filter(extract('month', Expense.date) == month)
            .group_by(Expense.category)
        )
        expenses_data = expenses_result.all()

        total_expenses = sum(amount for _, amount in expenses_data)
        category_analysis = []
        if total_expenses > 0:
            for category, amount in expenses_data:
                category_analysis.append(CategoryAnalysis(
                    category=category,
                    amount=amount,
                    percentage=round((amount / total_expenses) * 100, 2)
                ))

        # 2. Total Savings (sum of current_amount across all goals)
        goals_result = await db.execute(
            select(func.sum(Goal.current_amount)).filter(Goal.user_id == user_id)
        )
        total_savings = goals_result.scalar() or 0.0

        # 3. Financial Health Score
        health_score = 50
        total_flow = total_expenses + total_savings
        if total_flow > 0:
            savings_ratio = total_savings / total_flow
            health_score += int(savings_ratio * 50)

        recommendations = []
        if health_score < 40:
            recommendations.append("Your expenses are significantly higher than savings. Consider reviewing your budget.")
        elif health_score > 80:
            recommendations.append("Great job! Your savings are very healthy.")
        else:
            recommendations.append("You're on track. Consider increasing your savings rate by 5%.")

        return MonthlyReport(
            month=f"{year}-{month:02d}",
            total_expenses=total_expenses,
            total_savings=total_savings,
            category_analysis=category_analysis,
            financial_health_score=health_score,
            recommendations=recommendations
        )
