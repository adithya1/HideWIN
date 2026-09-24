from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Query
from typing import List, Dict
import json
import logging

from services.api.core.database import async_session
from services.api.db_models.system import AuditLog
from services.api.core.security import get_current_user_ws

try:
    from agents.third_eye_graph import third_eye_graph
except ImportError:
    third_eye_graph = None
    logging.warning("third_eye_graph not found in agents module. Third-Eye queries will fallback.")

router = APIRouter(prefix="/ws", tags=["team-ai"])

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
    user = await get_current_user_ws(token)
    if not user:
        await websocket.close(code=1008)
        return

    await manager.connect(room_id, websocket)
    try:
        while True:
            data = await websocket.receive_text()
            
            try:
                payload = json.loads(data)
                if payload.get("type") == "third_eye_query":
                    question = payload.get("content", "")
                    
                    initial_state = {
                        "messages": [{"role": "user", "content": question}],
                        "is_question": False,
                        "context": "",
                        "shadow_code": "",
                        "llm_provider": payload.get("provider", "gemini"),
                        "user_id": user.id,
                        "assigned_specialist": "general"
                    }
                    
                    async with async_session() as db:
                        audit = AuditLog(
                            user_id=user.id,
                            event_type="THIRD_EYE_INVOCATION",
                            details=f"Query invoked in Room {room_id}"
                        )
                        db.add(audit)
                        await db.commit()

                    try:
                        if third_eye_graph:
                            result = third_eye_graph.invoke(initial_state)
                            response_text = result["messages"][-1].content
                        else:
                            response_text = "System: Third-Eye graph engine is offline."
                    except Exception as e:
                        logging.error(f"Graph Error: {e}")
                        response_text = "System: Third-Eye cluster unavailable."

                    agent_response = json.dumps({
                        "type": "third_eye_response", 
                        "content": response_text
                    })
                    
                    await websocket.send_text(agent_response)
                    await manager.broadcast(room_id, agent_response, sender=websocket)
                    continue

            except json.JSONDecodeError:
                pass 

            await manager.broadcast(room_id, data, sender=websocket)

    except WebSocketDisconnect:
        manager.disconnect(room_id, websocket)
