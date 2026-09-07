import os
import shutil

# 1. Copy the client folder to hidewin-fastapi
src_client = r"C:\Users\akula\Downloads\Hide-WIN - Copy\whisper-server\client"
dst_client = r"C:\Users\akula\Downloads\Hide-WIN - Copy\hidewin-fastapi\invite_client"

if not os.path.exists(dst_client):
    shutil.copytree(src_client, dst_client)

# 2. Inject endpoints into hidewin-fastapi/main.py
p = r"C:\Users\akula\Downloads\Hide-WIN - Copy\hidewin-fastapi\main.py"
with open(p, "r", encoding="utf-8") as f:
    text = f.read()

if "/ws/signaling/host/" not in text:
    signaling_code = """
import uuid
import json
from fastapi import WebSocket, WebSocketDisconnect

channels = {}

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
            
            if msg["type"] == "approve":
                if channels[channel_id]["participant"]:
                    await channels[channel_id]["participant"].send_json({"type": "approved", "permissions": msg.get("permissions", {})})
            
            elif msg["type"] == "ice_candidate" or msg["type"] == "offer" or msg["type"] == "answer":
                if channels[channel_id]["participant"]:
                    await channels[channel_id]["participant"].send_json(msg)

    except WebSocketDisconnect:
        del channels[channel_id]

@app.websocket("/ws/signaling/join/{channel_id}/{token}/{name}")
async def signaling_join(websocket: WebSocket, channel_id: str, token: str, name: str):
    await websocket.accept()
    
    if channel_id not in channels or channels[channel_id]["token"] != token:
        await websocket.send_json({"type": "error", "message": "Invalid channel or token"})
        await websocket.close()
        return
        
    if channels[channel_id]["participant"]:
        await websocket.send_json({"type": "error", "message": "Participant already joined"})
        await websocket.close()
        return
        
    channels[channel_id]["participant"] = websocket
    await channels[channel_id]["host"].send_json({"type": "participant_joined", "name": name})
    
    try:
        while True:
            data = await websocket.receive_text()
            msg = json.loads(data)
            
            if msg["type"] == "ice_candidate" or msg["type"] == "offer" or msg["type"] == "answer":
                await channels[channel_id]["host"].send_json(msg)
                
    except WebSocketDisconnect:
        channels[channel_id]["participant"] = None
        await channels[channel_id]["host"].send_json({"type": "participant_left"})

app.mount("/invite", StaticFiles(directory="invite_client"), name="invite")
"""
    # Append at the bottom
    text = text + "\n" + signaling_code
    with open(p, "w", encoding="utf-8") as f:
        f.write(text)

print("Migrated WebRTC to hidewin-fastapi!")
