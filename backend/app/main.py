import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.routes import auth, expenses, budgets, goals, bills, analytics, reports, ai, dashboard, chat, income
from app.middleware.logging_middleware import LoggingMiddleware
from app.middleware.error_handler import global_exception_handler

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("finova")

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Backend API for AI Personal Finance Manager",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request logging middleware
app.add_middleware(LoggingMiddleware)

# Global exception handler
app.add_exception_handler(Exception, global_exception_handler)

# Include Routers
app.include_router(auth.router, prefix=f"{settings.API_V1_STR}/auth", tags=["auth"])
app.include_router(dashboard.router, prefix=f"{settings.API_V1_STR}/dashboard", tags=["dashboard"])
app.include_router(expenses.router, prefix=f"{settings.API_V1_STR}/expenses", tags=["expenses"])
app.include_router(bills.router, prefix=f"{settings.API_V1_STR}/bills", tags=["bills"])
app.include_router(goals.router, prefix=f"{settings.API_V1_STR}/goals", tags=["goals"])
app.include_router(analytics.router, prefix=f"{settings.API_V1_STR}/analytics", tags=["analytics"])
app.include_router(reports.router, prefix=f"{settings.API_V1_STR}/reports", tags=["reports"])
app.include_router(budgets.router, prefix=f"{settings.API_V1_STR}/budgets", tags=["budgets"])
app.include_router(ai.router, prefix=f"{settings.API_V1_STR}/ai", tags=["ai"])
app.include_router(chat.router, prefix=f"{settings.API_V1_STR}/chat", tags=["chat"])
app.include_router(income.router, prefix=f"{settings.API_V1_STR}/income", tags=["income"])


@app.get("/")
async def root():
    return {"message": "Welcome to Finova AI Backend API"}


@app.get("/health")
async def health_check():
    return {"status": "healthy", "version": "1.0.0"}
