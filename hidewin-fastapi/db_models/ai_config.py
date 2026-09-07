from sqlalchemy import Column, Integer, String, DateTime, Boolean
from sqlalchemy.sql import func
from .base import Base


class ApiConfig(Base):
    """Legacy API config key-value store."""
    __tablename__ = "api_configs"
    key = Column(String, primary_key=True, index=True)
    value = Column(String, nullable=True)
    modified_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())


class AppSetting(Base):
    """Global configuration settings for the app, including AI Routing."""
    __tablename__ = "app_settings"
    id = Column(Integer, primary_key=True, index=True)
    setting_key = Column(String, unique=True, index=True)
    setting_value = Column(String, nullable=True)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())


class AiProviderKey(Base):
    """Secure storage for AI provider API keys (LLM: Gemini, Groq, OpenAI, etc.)."""
    __tablename__ = "ai_provider_keys"
    id = Column(Integer, primary_key=True, index=True)
    provider = Column(String, index=True)       # gemini, openai, groq, claude, custom
    custom_url = Column(String, nullable=True)  # Only used if provider is "custom"
    api_key_value = Column(String)
    enabled_models = Column(String, default="[]") # JSON string array of enabled models for this key
    is_enabled = Column(Boolean, default=True)  # Toggled ON/OFF in UI
    status = Column(String, default="Active")   # Active, Cooldown, Disabled
    quota_usage = Column(Integer, default=0)    # Number of requests made
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class SttProviderKey(Base):
    """
    Secure storage for Live Transcription (STT) provider configurations.

    Modes:
        groq_rest    — Groq Whisper REST API (no local server, ~3s chunks)
        deepgram_ws  — Deepgram WebSocket (real-time, word-by-word)
        local_ws     — Local Whisper server at ws://localhost:8001
        custom_ws    — Custom WebSocket URL

    Routing:
        priority=1 → primary engine
        priority=2 → fallback engine
        is_active + is_enabled → determines if engine receives traffic
    """
    __tablename__ = "stt_provider_keys"
    id = Column(Integer, primary_key=True, index=True)
    provider_name = Column(String, index=True)   # groq, deepgram, local, custom
    mode = Column(String, default="local_ws")    # groq_rest | deepgram_ws | local_ws | custom_ws
    encrypted_key = Column(String, nullable=True) # Fernet-encrypted API key
    key_hint = Column(String, nullable=True)      # last 4 chars — safe to display in UI
    enabled_models = Column(String, default="[]") # JSON string array of enabled STT models
    custom_url = Column(String, nullable=True)    # for custom_ws mode
    custom_name = Column(String, nullable=True)  # display label for custom providers
    is_enabled = Column(Boolean, default=False)  # key is configured and ready
    is_active = Column(Boolean, default=False)   # currently receiving traffic
    priority = Column(Integer, default=1)        # 1=primary, 2=fallback
    buffer_seconds = Column(Integer, default=3)  # audio buffer size for groq_rest mode
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

