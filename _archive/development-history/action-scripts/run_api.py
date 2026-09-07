import uuid

from fastapi import Depends
from sqlalchemy.orm import Session
from src.lib.database import get_db

import logging
logging.basicConfig(filename='../hidewin_debug.log', level=logging.DEBUG, format='%(asctime)s [%(levelname)s] FASTAPI: %(message)s', filemode='a')
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from src.lib.database import engine
import db_models  # noqa: F401 â€” import all models so SQLAlchemy registers every table
from db_models.base import Base

# Create all tables (idempotent â€” safe to run on every startup)
Base.metadata.create_all(bind=engine)


app = FastAPI(title="HideWIN Elite API", version="4.0.0", description="Enterprise SaaS Platform")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173", "file://", "app://.", "http://localhost:3000", "http://localhost:8000", "null"],
    allow_origin_regex=".*",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# â”€â”€ Routers â”€â”€
from src.api.admin import email_templates
from src.api.user import auth, user, context, code_pilot, resume, ai_proxy, stt, keys, calendar, meeting
from src.api.admin import vendor, billing, team, status_cards, reports, compliance, integrations
from src.api.guest import collaboration, voice_ws

app.include_router(auth.router)
app.include_router(vendor.router)
app.include_router(billing.router)
app.include_router(user.router)
app.include_router(team.router)
app.include_router(status_cards.router)
app.include_router(reports.router)
app.include_router(context.router)
app.include_router(compliance.router)
app.include_router(integrations.router)
app.include_router(code_pilot.router)
app.include_router(resume.router)
app.include_router(ai_proxy.router)
app.include_router(voice_ws.router, prefix="/api/voice-ws")
app.include_router(stt.router)
app.include_router(keys.router)
app.include_router(meeting.router)
app.include_router(email_templates.router, prefix="/api/admin")


# â”€â”€ Serve static public files â”€â”€
import os

import json
from fastapi import WebSocket, WebSocketDisconnect

channels = {}

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
    
    try:
        while True:
            data = await websocket.receive_text()
            msg = json.loads(data)
            
            # If msg has a target, send to that specific guest
            if "target" in msg:
                target_id = msg["target"]
                if target_id in channels[channel_id]["participants"]:
                    try:
                        await channels[channel_id]["participants"][target_id].send_json(msg)
                    except:
                        pass
            # Otherwise broadcast to all
            else:
                for p_ws in list(channels[channel_id]["participants"].values()):
                    try:
                        await p_ws.send_json(msg)
                    except:
                        pass
                try:
                    await channels[channel_id]["host"].send_json(msg)
                except:
                    pass

    except WebSocketDisconnect:
        del channels[channel_id]

@app.websocket("/ws/signaling/join/{channel_id}/{token}/{name}")
async def signaling_join(websocket: WebSocket, channel_id: str, token: str, name: str):
    await websocket.accept()
    
    if channel_id not in channels or channels[channel_id]["token"] != token:
        await websocket.send_json({"type": "error", "message": "Invalid channel or token"})
        await websocket.close()
        return
        
    import uuid
    guest_id = str(uuid.uuid4())
    channels[channel_id]["participants"][guest_id] = websocket
    
    try:
        await channels[channel_id]["host"].send_json({"type": "participant_joined", "name": name, "guest_id": guest_id})
    except:
        pass
        
    try:
        while True:
            data = await websocket.receive_text()
            msg = json.loads(data)
            
            # If msg has a target, send to that specific guest
            if "target" in msg:
                target_id = msg["target"]
                if target_id in channels[channel_id]["participants"]:
                    try:
                        await channels[channel_id]["participants"][target_id].send_json(msg)
                    except:
                        pass
            # Otherwise broadcast to all
            else:
                for p_ws in list(channels[channel_id]["participants"].values()):
                    try:
                        await p_ws.send_json(msg)
                    except:
                        pass
                try:
                    await channels[channel_id]["host"].send_json(msg)
                except:
                    pass

    except WebSocketDisconnect:
        if guest_id in channels.get(channel_id, {}).get("participants", {}):
            del channels[channel_id]["participants"][guest_id]
        try:
            await channels[channel_id]["host"].send_json({"type": "participant_left", "guest_id": guest_id})
        except:
            pass






@app.get("/api")
def api_root():
    return {"status": "HideWIN Elite API Running", "docs": "/docs", "version": "4.0.0"}

@app.get("/health")
def health():
    return {"status": "ok"}







    
    
@app.get("/debug/channels")
def debug_channels():
    return {"channels": {k: {"token": v["token"], "has_participant": v["participant"] is not None} for k, v in channels.items()}}






import os
from fastapi.staticfiles import StaticFiles

invite_dir = os.path.join(os.path.dirname(__file__), "invite_client")
if os.path.exists(invite_dir):
    app.mount("/invite", StaticFiles(directory=invite_dir), name="invite")


