"""
Application configuration module.
This module loads and validates all application settings. A new developer should start here to understand how the application receives configuration values.
"""
import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    APP_ENV: str = "development"
    DEBUG: bool = True
    DATABASE_URL: str
    ADMIN_EMAIL: str = "admin@example.com"
    ADMIN_PASSWORD: str = "changeme"
    JWT_SECRET_KEY: str = "supersecret"
    JWT_EXPIRE_MINUTES: int = 60 * 24 * 7
    LOG_LEVEL: str = "INFO"

    # STT Settings
    GROQ_API_KEY: str = ""
    MODEL_SIZE: str = "base.en"
    DEVICE: str = "auto"
    COMPUTE_TYPE: str = "default"

    class Config:
        env_file = ".env"

settings = Settings()
