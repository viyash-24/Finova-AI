from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.models.bill import Bill
from app.schemas.bill_schema import BillCreate


class BillService:
    @staticmethod
    async def get_all(db: AsyncSession, user_id: int):
        result = await db.execute(select(Bill).filter(Bill.user_id == user_id))
        return result.scalars().all()

    @staticmethod
    async def create(db: AsyncSession, user_id: int, bill_data: BillCreate):
        db_bill = Bill(
            user_id=user_id,
            name=bill_data.name,
            provider=bill_data.provider or "",
            amount=bill_data.amount,
            due_date=bill_data.dueDate,
            icon=bill_data.icon or "receipt_long",
        )
        db.add(db_bill)
        await db.commit()
        await db.refresh(db_bill)
        return db_bill

    @staticmethod
    async def delete(db: AsyncSession, bill_id: int, user_id: int):
        result = await db.execute(select(Bill).filter(Bill.id == bill_id, Bill.user_id == user_id))
        db_bill = result.scalars().first()
        if db_bill:
            await db.delete(db_bill)
            await db.commit()
            return True
        return False
