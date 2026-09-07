import re
path = r'C:\Users\akula\Downloads\Hide-WIN\hidewin-fastapi\db_models\meeting.py'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Add recipient_type to MeetingParticipant
content = re.sub(
    r'role = Column\(String, default="guest"\) # host, guest',
    r'role = Column(String, default="guest") # host, guest\n    recipient_type = Column(String, default="to") # to, cc, bcc',
    content
)

# Add MeetingAttachment model and relationship
attachment_model = """
class MeetingAttachment(Base):
    __tablename__ = "meeting_attachments"
    id = Column(Integer, primary_key=True, index=True)
    meeting_id = Column(String, ForeignKey("meetings.id"))
    filename = Column(String, nullable=False)
    content_type = Column(String, nullable=False)
    file_path = Column(String, nullable=False)
    
    meeting = relationship("Meeting", back_populates="attachments")
"""

content = content + "\n" + attachment_model

# Add attachments relationship to Meeting
content = re.sub(
    r'participants = relationship\("MeetingParticipant", back_populates="meeting", cascade="all, delete-orphan"\)',
    r'participants = relationship("MeetingParticipant", back_populates="meeting", cascade="all, delete-orphan")\n    attachments = relationship("MeetingAttachment", back_populates="meeting", cascade="all, delete-orphan")',
    content
)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
