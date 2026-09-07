from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Query
from typing import List, Dict
import json
from datetime import datetime

from services.api.core.database import async_session
from sqlalchemy import select
from services.api.db_models.session import Session, SessionParticipant
from services.api.core.security import get_current_user_ws

router = APIRouter(prefix="/collaboration", tags=["collaboration"])

class ConnectionManager:
    def __init__(self):
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
async def collaboration_endpoint(websocket: WebSocket, session_id: str, token: str = Query(None)):
    user = await get_current_user_ws(token)
    if not user:
        await websocket.close(code=1008)
        return

    async with async_session() as db:
        res = await db.execute(select(Session).filter(Session.id == session_id))
        session_record = res.scalars().first()
        
        has_access = False
        if session_record and session_record.user_id == user.id:
            has_access = True
        else:
            p_res = await db.execute(select(SessionParticipant).filter(
                SessionParticipant.session_id == session_id,
                SessionParticipant.user_id == user.id
            ))
            if p_res.scalars().first():
                has_access = True
                
        if not has_access:
            await websocket.close(code=1008)
            return

    await manager.connect(websocket, session_id)
    
    await manager.broadcast({
        "type": "USER_JOINED",
        "user": {"id": user.id, "email": user.email, "role": user.role},
        "timestamp": str(datetime.utcnow())
    }, session_id)

    try:
        while True:
            data = await websocket.receive_text()
            message = json.loads(data)
            
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
            "timestamp": str(datetime.utcnow())
        }, session_id)
