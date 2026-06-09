from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.models.goal import Goal
from app.schemas.goal_schema import GoalCreate


class GoalService:
    @staticmethod
    async def get_all(db: AsyncSession, user_id: int):
        result = await db.execute(select(Goal).filter(Goal.user_id == user_id))
        return result.scalars().all()

    @staticmethod
    async def create(db: AsyncSession, user_id: int, goal_data: GoalCreate):
        db_goal = Goal(
            user_id=user_id,
            title=goal_data.name,
            target_amount=goal_data.target,
            current_amount=goal_data.current or 0.0,
            est_date=goal_data.deadline,
            icon=goal_data.icon or "shield",
        )
        db.add(db_goal)
        await db.commit()
        await db.refresh(db_goal)
        return db_goal

    @staticmethod
    async def delete(db: AsyncSession, goal_id: int, user_id: int):
        result = await db.execute(select(Goal).filter(Goal.id == goal_id, Goal.user_id == user_id))
        db_goal = result.scalars().first()
        if db_goal:
            await db.delete(db_goal)
            await db.commit()
            return True
        return False
