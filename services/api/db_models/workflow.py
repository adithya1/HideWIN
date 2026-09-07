from sqlalchemy import Column, Integer, String, DateTime, Text, ForeignKey, JSON
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from .base import Base

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
