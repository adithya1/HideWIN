import re
path = r'C:\Users\akula\Downloads\Hide-WIN\hidewin-fastapi\run_api.py'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the signaling_host and signaling_join to check the database
replacement = r'''
from db_models import Meeting
from src.lib.database import SessionLocal

@app.websocket("/ws/signaling/host/{channel_id}")
async def signaling_host(websocket: WebSocket, channel_id: str):
    await websocket.accept()
    
    # Verify meeting exists in DB and grab its token/passcode
    db = SessionLocal()
    meeting = db.query(Meeting).filter(Meeting.id == channel_id).first()
    db.close()
    
    # If meeting isn't in DB, fallback to ephemeral token
    passcode = "12345678"
    if meeting and meeting.recurrence != "none" and len(meeting.recurrence) >= 8:
        # We can store the passcode in the recurrence field for now to avoid schema changes
        passcode = meeting.recurrence
    elif meeting:
        passcode = meeting.id.split('-')[-1].lower() # Fallback passcode from ID
    else:
        passcode = str(uuid.uuid4())[:8]

    if channel_id not in channels:
        channels[channel_id] = {"host": websocket, "participants": {}, "token": passcode}
    else:
        channels[channel_id]["host"] = websocket
        channels[channel_id]["token"] = passcode # Update token if it was ephemeral
        if "participants" not in channels[channel_id]:
            channels[channel_id]["participants"] = {}
    
    # Mark meeting active in DB
    if meeting:
        db = SessionLocal()
        db_meeting = db.query(Meeting).filter(Meeting.id == channel_id).first()
        if db_meeting:
            db_meeting.status = "ACTIVE"
            db.commit()
        db.close()

    await websocket.send_json({"type": "channel_created", "token": channels[channel_id]["token"]})
'''

# Use regex to replace the old signaling_host
content = re.sub(r'@app\.websocket\("/ws/signaling/host/\{channel_id\}"\)[\s\S]*?await websocket\.send_json\(\{"type": "channel_created", "token": channels\[channel_id\]\["token"\]\}\)', replacement.strip(), content)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
