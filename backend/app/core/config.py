import os
from typing import Optional
# pyrefly: ignore [missing-import]
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    # App Settings
    ENVIRONMENT: str = "development"
    PROJECT_NAME: str = "ADhoc.ai API Engine"
    
    # DB & Redis Credentials
    DATABASE_URL: str = "postgresql+asyncpg://postgres:postgres@postgres:5432/adhoc_db"
    REDIS_URL: str = "redis://redis:6379/0"
    
    # Secrets & Cryptography
    JWT_SECRET_KEY: str = "super-secret-jwt-key-key-key-123456"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 120
    
    # AI Engine Keys
    GROQ_API_KEY: Optional[str] = None
    DEEPGRAM_API_KEY: Optional[str] = None
    ELEVENLABS_API_KEY: Optional[str] = None

    # OAuth SSO Credentials
    GOOGLE_CLIENT_ID: Optional[str] = None
    GOOGLE_CLIENT_SECRET: Optional[str] = None
    MICROSOFT_CLIENT_ID: Optional[str] = None
    MICROSOFT_CLIENT_SECRET: Optional[str] = None
    FRONTEND_URL: str = "http://localhost:5173"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )

settings = Settings()
