from sqlalchemy import Column, Integer, String, DateTime, Text, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from .base import Base

class Session(Base):
    """A live AI/Human mission session."""
    __tablename__ = "sessions"
    id = Column(String, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    goal_id = Column(Integer, ForeignKey("goals.id"), nullable=True)
    title = Column(String, nullable=True)
    status = Column(String, default="ACTIVE")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    ended_at = Column(DateTime(timezone=True), nullable=True)
    
    user = relationship("User", back_populates="sessions")
    participants = relationship("SessionParticipant", back_populates="session", cascade="all, delete-orphan")

class SessionParticipant(Base):
    """Participants in a collaborative stealth meeting."""
    __tablename__ = "session_participants"
    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(String, ForeignKey("sessions.id"))
    user_id = Column(Integer, ForeignKey("users.id"))
    role = Column(String, default="ADVISOR")
    joined_at = Column(DateTime(timezone=True), server_default=func.now())
    
    session = relationship("Session", back_populates="participants")
    user = relationship("User", back_populates="participations")

class ShadowContext(Base):
    __tablename__ = "shadow_context"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    active_ide_code = Column(Text)
    file_path = Column(String)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
