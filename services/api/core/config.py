"""
Application configuration module.
This module loads and validates all application settings. A new developer should start here to understand how the application receives configuration values.
"""
from pydantic import Field, model_validator
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    APP_ENV: str = "development"
    DEBUG: bool = False
    DATABASE_URL: str
    ADMIN_EMAIL: str
    ADMIN_PASSWORD: str = Field(min_length=12)
    JWT_SECRET_KEY: str = Field(min_length=32)
    JWT_EXPIRE_MINUTES: int = 60 * 24 * 7
    LOG_LEVEL: str = "INFO"
    CORS_ORIGINS: str
    API_BASE_URL: str
    WEB_BASE_URL: str
    REDIS_URL: str = ""
    GOOGLE_OAUTH_AUTHORIZE_URL: str = "https://accounts.google.com/o/oauth2/v2/auth"
    GOOGLE_OAUTH_TOKEN_URL: str = "https://oauth2.googleapis.com/token"
    GOOGLE_USERINFO_URL: str = "https://www.googleapis.com/oauth2/v3/userinfo"
    GOOGLE_CALENDAR_EVENTS_URL: str = "https://www.googleapis.com/calendar/v3/calendars/primary/events"
    OUTLOOK_OAUTH_AUTHORIZE_URL: str = "https://login.microsoftonline.com/common/oauth2/v2.0/authorize"
    OUTLOOK_OAUTH_TOKEN_URL: str = "https://login.microsoftonline.com/common/oauth2/v2.0/token"
    OUTLOOK_CALENDAR_EVENTS_URL: str = "https://graph.microsoft.com/v1.0/me/events"

    # STT Settings
    GROQ_API_KEY: str = ""
    MODEL_SIZE: str = "base.en"
    DEVICE: str = "auto"
    COMPUTE_TYPE: str = "default"

    class Config:
        env_file = ".env"

    @property
    def cors_origin_list(self) -> list[str]:
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",") if origin.strip()]

    @model_validator(mode="after")
    def validate_production_settings(self):
        if self.APP_ENV.lower() == "production":
            if self.DEBUG:
                raise ValueError("DEBUG must be disabled in production")
            if "*" in self.cors_origin_list:
                raise ValueError("Wildcard CORS origins are not allowed in production")
            if any(not origin.startswith("https://") for origin in self.cors_origin_list):
                raise ValueError("Production CORS origins must use HTTPS")
        return self

settings = Settings()
