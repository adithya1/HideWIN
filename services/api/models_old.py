from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, DateTime, Text, Float, JSON
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
import json
from database import Base

class ApiConfig(Base):
    __tablename__ = "api_configs"
    key = Column(String, primary_key=True, index=True)
    value = Column(String, nullable=True)
    modified_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())


class Plan(Base):
    """Billing plans / pricing tiers."""
    __tablename__ = "plans"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)         # "Free", "Pro", "Pro + Undetectability"
    slug = Column(String, unique=True, index=True)         # "free", "pro", "pro_stealth"
    price_monthly = Column(Float, default=0.0)             # USD per month
    stripe_price_id = Column(String, nullable=True)        # Stripe Price ID (admin configures)
    features = Column(JSON, default=list)                  # ["Unlimited sessions", "Stealth mode", ...]
    seat_limit = Column(Integer, nullable=True)            # null = unlimited
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    subscriptions = relationship("Subscription", back_populates="plan")


class Subscription(Base):
    """User or Vendor subscriptions to a billing plan."""
    __tablename__ = "subscriptions"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True)
    plan_id = Column(Integer, ForeignKey("plans.id"))
    stripe_subscription_id = Column(String, nullable=True)     # Stripe subscription ID
    stripe_customer_id = Column(String, nullable=True)         # Stripe customer ID
    status = Column(String, default="active")                  # active, cancelled, past_due, trialing
    started_at = Column(DateTime(timezone=True), server_default=func.now())
    next_billing_at = Column(DateTime(timezone=True), nullable=True)
    cancelled_at = Column(DateTime(timezone=True), nullable=True)

    user = relationship("User", back_populates="subscription")
    plan = relationship("Plan", back_populates="subscriptions")


class InviteToken(Base):
    """Pending invite links."""
    __tablename__ = "invite_tokens"
    id = Column(Integer, primary_key=True, index=True)
    token = Column(String, unique=True, index=True)
    email = Column(String)
    invited_by_user_id = Column(Integer, ForeignKey("users.id"))
    vendor_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    used = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    password = Column(String, nullable=True)                   # nullable for OAuth-only users
    full_name = Column(String, nullable=True)
    role = Column(String, default="USER")                      # "ADMIN", "VENDOR", "USER"
    is_premium = Column(Boolean, default=False)
    is_verified = Column(Boolean, default=False)
    is_suspended = Column(Boolean, default=False)
    logo_url = Column(String, nullable=True)
    theme = Column(String, default="light")
    # B2B & Licensing
    user_type = Column(String, default="SELF")                 # "SELF" (S-User), "CORPORATE" (C-User)
    allocated_seats = Column(Integer, default=0)
    vendor_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    email_notifications = Column(Boolean, default=False)
    last_logged_in = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    session_purpose = Column(String, nullable=True)
    context_data = Column(Text, nullable=True)
    # OAuth
    google_id = Column(String, nullable=True)                  # Unique constraint removed to support bulk seeding with NULLs
    # Stripe
    stripe_customer_id = Column(String, nullable=True)
    _permissions = Column("permissions", Text, default="{}")   # Stored as JSON string for absolute compatibility
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    @property
    def permissions(self):
        try:
            return json.loads(self._permissions or "{}")
        except:
            return {}

    @permissions.setter
    def permissions(self, value):
        self._permissions = json.dumps(value or {})

    # Relationships
    devices = relationship("Device", back_populates="owner", cascade="all, delete-orphan")
    manager = relationship("User", back_populates="subordinates", remote_side=[id], foreign_keys=[vendor_id])
    subordinates = relationship("User", back_populates="manager")
    integrations = relationship("Integration", back_populates="user", cascade="all, delete-orphan")
    tasks = relationship("Task", back_populates="user", cascade="all, delete-orphan")
    goals = relationship("Goal", back_populates="user", cascade="all, delete-orphan", foreign_keys="[Goal.user_id]")
    work_reports = relationship("WorkReport", back_populates="user", cascade="all, delete-orphan", foreign_keys="[WorkReport.user_id]")
    notifications = relationship("Notification", back_populates="user", cascade="all, delete-orphan")
    subscription = relationship("Subscription", back_populates="user", uselist=False)
    sessions = relationship("Session", back_populates="user", cascade="all, delete-orphan")
    participations = relationship("SessionParticipant", back_populates="user", cascade="all, delete-orphan")


class Device(Base):
    __tablename__ = "devices"
    mac_address = Column(String, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    trial_hits = Column(Integer, default=0)
    last_used = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    owner = relationship("User", back_populates="devices")


# ━━━ AGENTIC WORKFLOW & AGILE TABLES ━━━

class Integration(Base):
    __tablename__ = "integrations"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    platform = Column(String, index=True)
    api_url = Column(String, nullable=True)
    access_token = Column(String)
    user = relationship("User", back_populates="integrations")

class Goal(Base):
    __tablename__ = "goals"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    vendor_id = Column(Integer, ForeignKey("users.id"))
    title = Column(String)
    description = Column(Text, nullable=True)
    status = Column(String, default="IN_PROGRESS")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    user = relationship("User", back_populates="goals", foreign_keys=[user_id])

class Task(Base):
    __tablename__ = "tasks"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    goal_id = Column(Integer, ForeignKey("goals.id"), nullable=True)
    title = Column(String)
    pomodoro_sessions = Column(Integer, default=0)
    status = Column(String, default="TODO")
    jira_ticket_ref = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    user = relationship("User", back_populates="tasks")

class WorkReport(Base):
    __tablename__ = "work_reports"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    vendor_id = Column(Integer, ForeignKey("users.id"))
    report_type = Column(String)
    summary_data = Column(JSON)
    generated_at = Column(DateTime(timezone=True), server_default=func.now())
    user = relationship("User", back_populates="work_reports", foreign_keys=[user_id])

class Notification(Base):
    __tablename__ = "notifications"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    title = Column(String)
    message = Column(Text)
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    user = relationship("User", back_populates="notifications")

class TokenBilling(Base):
    __tablename__ = "token_billing"
    id = Column(Integer, primary_key=True, index=True)
    vendor_id = Column(Integer, ForeignKey("users.id"))
    total_tokens = Column(Integer, default=0)
    estimated_cost_usd = Column(Integer, default=0)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

class ShadowContext(Base):
    __tablename__ = "shadow_context"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    active_ide_code = Column(Text)
    file_path = Column(String)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

class Session(Base):
    """A live AI/Human mission session."""
    __tablename__ = "sessions"
    id = Column(String, primary_key=True, index=True)           # UUID
    user_id = Column(Integer, ForeignKey("users.id"))
    goal_id = Column(Integer, ForeignKey("goals.id"), nullable=True)
    title = Column(String, nullable=True)
    status = Column(String, default="ACTIVE")                  # ACTIVE, COMPLETED, ARCHIVED
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    ended_at = Column(DateTime(timezone=True), nullable=True)
    
    # Relationships
    user = relationship("User", back_populates="sessions")
    participants = relationship("SessionParticipant", back_populates="session", cascade="all, delete-orphan")

class SessionParticipant(Base):
    """Participants in a collaborative stealth meeting."""
    __tablename__ = "session_participants"
    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(String, ForeignKey("sessions.id"))
    user_id = Column(Integer, ForeignKey("users.id"))
    role = Column(String, default="ADVISOR")                   # LEAD, ADVISOR, OBSERVER
    joined_at = Column(DateTime(timezone=True), server_default=func.now())
    
    session = relationship("Session", back_populates="participants")
    user = relationship("User", back_populates="participations")

class AuditLog(Base):
    __tablename__ = "audit_logs"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    actor_email = Column(String, nullable=True)
    event_type = Column(String)
    details = Column(Text, nullable=True)
    encrypted_payload = Column(Text, nullable=True)
    ip_address = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class AppSetting(Base):
    """Global configuration settings for the app, including AI Routing."""
    __tablename__ = "app_settings"
    id = Column(Integer, primary_key=True, index=True)
    setting_key = Column(String, unique=True, index=True)
    setting_value = Column(String, nullable=True)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

class AiProviderKey(Base):
    """Secure storage for AI provider API keys with usage tracking and load balancing status."""
    __tablename__ = "ai_provider_keys"
    id = Column(Integer, primary_key=True, index=True)
    provider = Column(String, index=True) # gemini, openai, groq, claude, custom
    custom_url = Column(String, nullable=True) # Only used if provider is "custom"
    api_key_value = Column(String)
    is_enabled = Column(Boolean, default=True) # Toggled ON/OFF in UI
    status = Column(String, default="Active") # Active, Cooldown, Disabled
    quota_usage = Column(Integer, default=0) # Number of requests made
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class SttProviderKey(Base):
    __tablename__ = 'stt_provider_keys'
    id = Column(Integer, primary_key=True, index=True)
    provider_name = Column(String, index=True) # groq, deepgram, custom
    api_key_value = Column(String, nullable=True)
    custom_url = Column(String, nullable=True)
    is_enabled = Column(Boolean, default=False)
    is_active = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
