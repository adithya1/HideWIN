from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Dict
import json
import db_models as models
import src.schemas.schemas as schemas
from src.lib.database import get_db
from src.api.user.auth import get_current_user_ws

router = APIRouter(prefix="/api/collaboration", tags=["collaboration"])

# ── Connection Manager ──
class ConnectionManager:
    def __init__(self):
        # session_id -> list of active websockets
        self.active_connections: Dict[str, List[WebSocket]] = {}

    async def connect(self, websocket: WebSocket, session_id: str):
        await websocket.accept()
        if session_id not in self.active_connections:
            self.active_connections[session_id] = []
        self.active_connections[session_id].append(websocket)

    def disconnect(self, websocket: WebSocket, session_id: str):
        if session_id in self.active_connections:
            self.active_connections[session_id].remove(websocket)
            if not self.active_connections[session_id]:
                del self.active_connections[session_id]

    async def broadcast(self, message: dict, session_id: str):
        if session_id in self.active_connections:
            for connection in self.active_connections[session_id]:
                await connection.send_json(message)

manager = ConnectionManager()

@router.websocket("/ws/{session_id}")
async def collaboration_endpoint(websocket: WebSocket, session_id: str, token: str = None):
    # 1. Authenticate user from token (passed as query param for WS)
    user = await get_current_user_ws(token)
    if not user:
        await websocket.close(code=1008)
        return

    # 2. Verify user has access to this session
    db = next(get_db())
    session_record = db.query(models.Session).filter(models.Session.id == session_id).first()
    if not session_record:
        # Check if user is a participant
        participant = db.query(models.SessionParticipant).filter(
            models.SessionParticipant.session_id == session_id,
            models.SessionParticipant.user_id == user.id
        ).first()
        if not participant and session_record.user_id != user.id:
            await websocket.close(code=1008)
            return

    await manager.connect(websocket, session_id)
    
    # Notify others that a user joined
    await manager.broadcast({
        "type": "USER_JOINED",
        "user": {"id": user.id, "email": user.email, "role": user.role},
        "timestamp": str(models.func.now())
    }, session_id)

    try:
        while True:
            data = await websocket.receive_text()
            message = json.loads(data)
            
            # Broadcast the collaborative event
            # event types: TRANSCRIPT, ADVICE, NOTEPAD_SYNC, IMAGE_SHARED, REMOTE_TYPE
            broadcast_msg = {
                "sender": user.email,
                "role": user.role,
                **message
            }
            await manager.broadcast(broadcast_msg, session_id)
            
    except WebSocketDisconnect:
        manager.disconnect(websocket, session_id)
        await manager.broadcast({
            "type": "USER_LEFT",
            "user": user.email,
            "timestamp": str(models.func.now())
        }, session_id)
