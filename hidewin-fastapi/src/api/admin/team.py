from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends, HTTPException, Query
from typing import List, Dict
import json
import logging

from src.lib.database import SessionLocal
import db_models as models
from src.api.user.auth import get_current_user_ws
from agents.third_eye_graph import third_eye_graph

router = APIRouter(prefix="/ws", tags=["webrtc-team"])

class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[str, List[WebSocket]] = {}

    async def connect(self, room_id: str, websocket: WebSocket):
        await websocket.accept()
        if room_id not in self.active_connections:
            self.active_connections[room_id] = []
        self.active_connections[room_id].append(websocket)

    def disconnect(self, room_id: str, websocket: WebSocket):
        if room_id in self.active_connections:
            self.active_connections[room_id].remove(websocket)
            if not self.active_connections[room_id]:
                del self.active_connections[room_id]

    async def broadcast(self, room_id: str, message: str, sender: WebSocket = None):
        if room_id in self.active_connections:
            for connection in self.active_connections[room_id]:
                if connection != sender:
                    await connection.send_text(message)

manager = ConnectionManager()

@router.websocket("/team/{room_id}")
async def websocket_team_endpoint(websocket: WebSocket, room_id: str, token: str = Query(None)):
    """
    Secure WebRTC Multiplayer Integration
    Allows teammates to join and stream logic, or fall back to Third-Eye Graph for autonomous RAG queries.
    """
    user = await get_current_user_ws(token)
    if not user:
        await websocket.close(code=1008)
        return

    await manager.connect(room_id, websocket)
    try:
        while True:
            data = await websocket.receive_text()
            
            # Check if it's JSON for structured logic
            try:
                payload = json.loads(data)
                if payload.get("type") == "third_eye_query":
                    # Directly trigger LangGraph "Third-Eye" Agent
                    question = payload.get("content", "")
                    
                    # Prepare initial state for the graph
                    initial_state = {
                        "messages": [{"role": "user", "content": question}],
                        "is_question": False,
                        "context": "",
                        "shadow_code": "",
                        "llm_provider": payload.get("provider", "gemini"),
                        "user_id": user.id,
                        "assigned_specialist": "general"
                    }
                    
                    # Log audit event for Enterprise monitoring
                    db = SessionLocal()
                    audit = models.AuditLog(
                        user_id=user.id,
                        event_type="THIRD_EYE_INVOCATION",
                        encrypted_payload=f"Query invoked in Room {room_id}"
                    )
                    db.add(audit)
                    db.commit()
                    db.close()

                    # Execute Agent pipeline
                    try:
                        result = third_eye_graph.invoke(initial_state)
                        # Extract final AI Message content
                        response_text = result["messages"][-1].content
                    except Exception as e:
                        logging.error(f"Graph Error: {e}")
                        response_text = "System: Third-Eye cluster unavailable."

                    agent_response = json.dumps({
                        "type": "third_eye_response", 
                        "content": response_text
                    })
                    
                    # Echo response uniquely to the sender, then broadcast
                    await websocket.send_text(agent_response)
                    await manager.broadcast(room_id, agent_response, sender=websocket)
                    continue

            except json.JSONDecodeError:
                pass # Just raw text

            # Standard broadcast for human collaboration 
            await manager.broadcast(room_id, data, sender=websocket)

    except WebSocketDisconnect:
        manager.disconnect(room_id, websocket)
