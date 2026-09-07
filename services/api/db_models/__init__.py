# db_models/__init__.py
# =====================
# Central aggregator for all domain models.
# Import everything through this file to ensure SQLAlchemy's
# relationship resolver can find all models before create_all() is called.
#
# Future DB change (e.g., PostgreSQL):
#   → Only change DATABASE_URL in database.py
#   → SQLAlchemy handles the rest automatically
#
# Usage in routers:
#   from db_models import User, Session, AiProviderKey

from .base import Base

# User domain
from .user import User, Device, Integration

# Billing domain
from .billing import Plan, Subscription, TokenBilling

# Workflow domain
from .workflow import Goal, Task, WorkReport

# Session domain
from .session import Session, SessionParticipant, ShadowContext

from .meeting import Meeting, MeetingParticipant

# Email Templates
from .email_template import EmailTemplate

# System domain
from .system import InviteToken, Notification, AuditLog

# AI Configuration domain
from .ai_config import ApiConfig, AppSetting, AiProviderKey, SttProviderKey

__all__ = [
    "Base",
    # User
    "User", "Device", "Integration",
    # Billing
    "Plan", "Subscription", "TokenBilling",
    # Workflow
    "Goal", "Task", "WorkReport",
    # Session
    "Session", "SessionParticipant", "ShadowContext",
    # System
        "InviteToken", "Notification", "AuditLog",
    # Meeting
    "Meeting", "MeetingParticipant",
    "EmailTemplate",
    # AI Config
    "ApiConfig", "AppSetting", "AiProviderKey", "SttProviderKey",
]
