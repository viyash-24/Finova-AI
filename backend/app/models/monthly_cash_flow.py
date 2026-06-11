from sqlalchemy import Column, String, Float
from app.core.database import Base

class MonthlyCashFlow(Base):
    __tablename__ = "monthly_cash_flow"

    month = Column(String(50), primary_key=True, index=True)
    income = Column(Float, nullable=False, default=0.0)
    expenses = Column(Float, nullable=False, default=0.0)
