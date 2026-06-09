import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Finova AI Backend"
    API_V1_STR: str = "/api"
    DATABASE_URL: str = os.getenv("DATABASE_URL", "postgresql://user:password@localhost/finova")
    CLERK_SECRET_KEY: str = os.getenv("CLERK_SECRET_KEY", "")
    CLERK_FRONTEND_API: str = os.getenv("CLERK_FRONTEND_API", "")
    AI_SERVICE_URL: str = os.getenv("AI_SERVICE_URL", "http://localhost:8001")
    CORS_ORIGINS: list = ["http://localhost:3000", "http://localhost:3001"]

    class Config:
        env_file = ".env"

settings = Settings()
