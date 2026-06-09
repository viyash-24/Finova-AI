from sqlalchemy.ext.asyncio import AsyncSession


class BudgetService:
    """Budget service stub. No 'budgets' table exists in the current database.
    These methods return safe empty responses to prevent import errors
    from the budgets route."""

    @staticmethod
    async def get_all(db: AsyncSession, user_id: int):
        return []

    @staticmethod
    async def create(db: AsyncSession, user_id: int, budget_data):
        return None

    @staticmethod
    async def update(db: AsyncSession, budget_id: int, user_id: int, budget_data):
        return None

    @staticmethod
    async def delete(db: AsyncSession, budget_id: int, user_id: int):
        return False
