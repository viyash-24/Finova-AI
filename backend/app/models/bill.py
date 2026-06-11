from sqlalchemy import Column, Integer, String, Float, Date, DateTime, Boolean, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.core.database import Base

class Bill(Base):
    __tablename__ = "bills"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    name = Column(String(255), nullable=False)
    category = Column(String(100), nullable=False, default="Utilities")
    amount = Column(Float, nullable=False)
    due_date = Column(Date, nullable=False)
    is_recurring = Column(Boolean, default=True)
    status = Column(String(50), default="upcoming")
    icon = Column(String(100), nullable=True)
    provider = Column(String(255), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User")
