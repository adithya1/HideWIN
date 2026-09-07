import asyncio
import json
from fastapi import APIRouter, WebSocket, WebSocketDisconnect

router = APIRouter()

@router.websocket("/stream")
async def websocket_voice_stream(websocket: WebSocket):
    await websocket.accept()
    
    try:
        while True:
            data = await websocket.receive()
            if "bytes" in data:
                audio_chunk = data["bytes"]
                response = {"type": "stt_result", "text": "Received chunk."}
                await websocket.send_text(json.dumps(response))
            elif "text" in data:
                try:
                    payload = json.loads(data["text"])
                    if payload.get("action") == "start_session":
                        await websocket.send_text(json.dumps({"status": "session_started"}))
                except json.JSONDecodeError:
                    pass
    except WebSocketDisconnect:
        print("Client disconnected from Voice WS")
    except Exception as e:
        print(f"WS Error: {e}")
        try:
            await websocket.close()
        except:
            pass
