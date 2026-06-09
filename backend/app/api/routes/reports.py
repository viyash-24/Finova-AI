from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from datetime import datetime
from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.user import User
from app.schemas.report_schema import MonthlyReport
from app.services.report_service import ReportService

router = APIRouter()


@router.get("/monthly", response_model=MonthlyReport)
async def get_monthly_report(
    year: int = Query(default=None),
    month: int = Query(default=None),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if year is None:
        year = datetime.now().year
    if month is None:
        month = datetime.now().month
    return await ReportService.generate_monthly_report(db, current_user.id, year, month)
