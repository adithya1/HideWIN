import re

file_path = "services/api/db_models/meeting.py"
with open(file_path, "r", encoding="utf-8") as f:
    text = f.read()

new_model = """class MeetingReminderLog(Base):
    __tablename__ = "meeting_reminder_logs"
    id = Column(Integer, primary_key=True, index=True)
    meeting_id = Column(String, ForeignKey("meetings.id"), index=True)
    recipient_email = Column(String, index=True)
    reminder_type = Column(String, index=True) # e.g., '24h', '1h', '10m'
    sent_at = Column(DateTime(timezone=True), server_default=func.now())
"""

text = text + "\n" + new_model

with open(file_path, "w", encoding="utf-8") as f:
    f.write(text)

print("Added MeetingReminderLog to models!")
