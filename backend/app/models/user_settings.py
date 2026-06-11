from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.core.database import Base


class UserSettings(Base):
    __tablename__ = "user_settings"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    notifications_email = Column(Boolean, default=True)
    notifications_push = Column(Boolean, default=True)
    notifications_sms = Column(Boolean, default=False)
    theme = Column(String(50), default="dark")
    currency = Column(String(10), default="USD")
    language = Column(String(10), default="en")
    two_factor_enabled = Column(Boolean, default=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    user = relationship("User")
