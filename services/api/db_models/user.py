import json
from sqlalchemy import Column, Integer, String, DateTime, Text, ForeignKey, JSON, Boolean
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from .base import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    vendor_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    role = Column(String, default="USER")
    is_active = Column(Boolean, default=True)
    is_suspended = Column(Boolean, default=False)
    full_name = Column(String, nullable=True)
    is_premium = Column(Boolean, default=False)
    is_verified = Column(Boolean, default=False)
    logo_url = Column(String, nullable=True)
    theme = Column(String, nullable=True)
    user_type = Column(String, default="SELF")
    allocated_seats = Column(Integer, default=1)
    email_notifications = Column(Boolean, default=True)
    last_logged_in = Column(DateTime(timezone=True), nullable=True)
    session_purpose = Column(String, nullable=True)
    context_data = Column(Text, nullable=True)
    google_id = Column(String, nullable=True)
    
    # Calendar Sync & Tokens
    google_access_token = Column(String, nullable=True)
    google_refresh_token = Column(String, nullable=True)
    google_token_expiry = Column(DateTime(timezone=True), nullable=True)
    sync_google_calendar = Column(Boolean, default=False)
    
    outlook_access_token = Column(String, nullable=True)
    outlook_refresh_token = Column(String, nullable=True)
    outlook_token_expiry = Column(DateTime(timezone=True), nullable=True)
    sync_outlook_calendar = Column(Boolean, default=False)

    stripe_customer_id = Column(String, nullable=True)
    
    # OTP Progressive Rate Limiting & Lockout
    failed_otp_attempts = Column(Integer, default=0)
    otp_block_level = Column(Integer, default=0)
    blocked_until = Column(DateTime(timezone=True), nullable=True)
    admin_unblock_required = Column(Boolean, default=False)
    
    _permissions = Column("permissions", Text, default="{}")
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

class Integration(Base):
    __tablename__ = "integrations"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    platform = Column(String, index=True)
    api_url = Column(String, nullable=True)
    access_token = Column(String)
    user = relationship("User", back_populates="integrations")
