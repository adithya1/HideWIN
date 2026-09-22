from sqlalchemy import Column, Integer, String, DateTime, Text, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from .base import Base

class Meeting(Base):
    __tablename__ = "meetings"
    id = Column(String, primary_key=True, index=True) # E.g., 'HW-ABCD-EFGH'
    host_id = Column(Integer, ForeignKey("users.id"))
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    start_time = Column(DateTime(timezone=True), nullable=True)
    end_time = Column(DateTime(timezone=True), nullable=True)
    timezone = Column(String, default="UTC")
    recurrence = Column(String, default="none")
    status = Column(String, default="SCHEDULED") # SCHEDULED, ACTIVE, COMPLETED
    google_event_id = Column(String, nullable=True)
    outlook_event_id = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    host = relationship("User")
    participants = relationship("MeetingParticipant", back_populates="meeting", cascade="all, delete-orphan")
    attachments = relationship("MeetingAttachment", back_populates="meeting", cascade="all, delete-orphan")

class MeetingParticipant(Base):
    __tablename__ = "meeting_participants"
    id = Column(Integer, primary_key=True, index=True)
    meeting_id = Column(String, ForeignKey("meetings.id"))
    email = Column(String, nullable=False)
    role = Column(String, default="guest") # host, guest
    recipient_type = Column(String, default="to") # to, cc, bcc
    
    meeting = relationship("Meeting", back_populates="participants")



class MeetingAttachment(Base):
    __tablename__ = "meeting_attachments"
    id = Column(Integer, primary_key=True, index=True)
    meeting_id = Column(String, ForeignKey("meetings.id"))
    filename = Column(String, nullable=False)
    content_type = Column(String, nullable=False)
    file_path = Column(String, nullable=False)
    
    meeting = relationship("Meeting", back_populates="attachments")

class MeetingReminderLog(Base):
    __tablename__ = "meeting_reminder_logs"
    id = Column(Integer, primary_key=True, index=True)
    meeting_id = Column(String, ForeignKey("meetings.id"), index=True)
    recipient_email = Column(String, index=True)
    reminder_type = Column(String, index=True) # e.g., '24h', '1h', '10m'
    sent_at = Column(DateTime(timezone=True), server_default=func.now())
