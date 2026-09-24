import os
import sys

server_path = r"C:\Users\akula\Downloads\Hide-WIN - Copy\whisper-server\server.py"

with open(server_path, 'r', encoding='utf-8') as f:
    code = f.read()

if "channels = {}" not in code:
    injection = """
import uuid
import json
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles

# --- SIGNALING SERVER FOR COLLABORATION ---
channels = {}

# Serve the web client
os.makedirs("client", exist_ok=True)
app.mount("/invite", StaticFiles(directory="client", html=True), name="invite")

@app.websocket("/ws/signaling/host/{channel_id}")
async def signaling_host(websocket: WebSocket, channel_id: str):
    await websocket.accept()
    if channel_id not in channels:
        channels[channel_id] = {"host": websocket, "participant": None, "token": str(uuid.uuid4())[:8]}
    
    await websocket.send_json({"type": "channel_created", "token": channels[channel_id]["token"]})
    
    try:
        while True:
            data = await websocket.receive_text()
            msg = json.loads(data)
            part = channels.get(channel_id, {}).get("participant")
            if part:
                await part.send_text(data)
    except WebSocketDisconnect:
        channels.pop(channel_id, None)
        print(f"[Signaling] Host disconnected {channel_id}")

@app.websocket("/ws/signaling/join/{channel_id}/{token}")
async def signaling_join(websocket: WebSocket, channel_id: str, token: str):
    await websocket.accept()
    channel = channels.get(channel_id)
    if not channel or channel["token"] != token:
        await websocket.send_json({"type": "error", "message": "Invalid channel or token"})
        await websocket.close()
        return
        
    if channel["participant"]:
        await websocket.send_json({"type": "error", "message": "Participant already joined"})
        await websocket.close()
        return
        
    channel["participant"] = websocket
    await channel["host"].send_json({"type": "participant_joined", "name": "Guest"})
    
    try:
        while True:
            data = await websocket.receive_text()
            host_ws = channels.get(channel_id, {}).get("host")
            if host_ws:
                await host_ws.send_text(data)
    except WebSocketDisconnect:
        if channel_id in channels:
            channels[channel_id]["participant"] = None
            host_ws = channels.get(channel_id, {}).get("host")
            if host_ws:
                await host_ws.send_json({"type": "participant_left"})
        print(f"[Signaling] Participant disconnected {channel_id}")

"""
    code = code.replace("app = FastAPI(title=\"Whisper STT Server (Local + Groq)\")", "app = FastAPI(title=\"Whisper STT Server (Local + Groq)\")\n" + injection)
    with open(server_path, 'w', encoding='utf-8') as f:
        f.write(code)
    print("Patched server.py successfully")
else:
    print("Already patched")
