from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import desc
from app.models.expense import Expense
from app.schemas.expense_schema import ExpenseCreate


class ExpenseService:
    @staticmethod
    async def get_all(db: AsyncSession, user_id: int, skip: int = 0, limit: int = 100):
        result = await db.execute(
            select(Expense).filter(Expense.user_id == user_id)
            .order_by(desc(Expense.date))
            .offset(skip).limit(limit)
        )
        return result.scalars().all()

    @staticmethod
    async def create(db: AsyncSession, user_id: int, expense_data: ExpenseCreate):
        db_expense = Expense(
            user_id=user_id,
            merchant=expense_data.description,
            category=expense_data.category,
            amount=expense_data.amount,
            date=expense_data.date
        )
        db.add(db_expense)
        await db.commit()
        await db.refresh(db_expense)
        return db_expense

    @staticmethod
    async def get_by_id(db: AsyncSession, expense_id: int, user_id: int):
        result = await db.execute(
            select(Expense).filter(Expense.id == expense_id, Expense.user_id == user_id)
        )
        return result.scalars().first()

    @staticmethod
    async def delete(db: AsyncSession, expense_id: int, user_id: int):
        db_expense = await ExpenseService.get_by_id(db, expense_id, user_id)
        if db_expense:
            await db.delete(db_expense)
            await db.commit()
            return True
        return False
