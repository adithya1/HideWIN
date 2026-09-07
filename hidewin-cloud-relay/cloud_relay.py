import os
import json
import uuid
import asyncio
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Hide-WIN Cloud Relay")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

channels = {}

@app.websocket("/ws/signaling/host/{channel_id}")
async def signaling_host(websocket: WebSocket, channel_id: str):
    await websocket.accept()
    if channel_id not in channels:
        channels[channel_id] = {"host": websocket, "participants": {}, "token": str(uuid.uuid4())[:8]}
    else:
        channels[channel_id]["host"] = websocket
        if "participants" not in channels[channel_id]:
            channels[channel_id]["participants"] = {}
    
    await websocket.send_json({"type": "channel_created", "token": channels[channel_id]["token"]})
    
    try:
        while True:
            data = await websocket.receive_text()
            msg = json.loads(data)
            
            # Host broadcasting to ALL participants
            if msg["type"] in ["ai_answer", "transcript"]:
                for p_ws in list(channels[channel_id]["participants"].values()):
                    try:
                        await p_ws.send_json(msg)
                    except:
                        pass
                        
            # Host targeted messages to a specific participant
            elif "target" in msg:
                target_id = msg["target"]
                if target_id in channels[channel_id]["participants"]:
                    try:
                        await channels[channel_id]["participants"][target_id].send_json(msg)
                    except:
                        pass

    except WebSocketDisconnect:
        if channel_id in channels:
            del channels[channel_id]

@app.websocket("/ws/signaling/join/{channel_id}/{token}/{name}")
async def signaling_join(websocket: WebSocket, channel_id: str, token: str, name: str):
    await websocket.accept()
    
    if channel_id not in channels or channels[channel_id]["token"] != token:
        await websocket.send_json({"type": "error", "message": "Invalid channel or token"})
        await websocket.close()
        return
        
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
            msg["source"] = guest_id
            
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

# Serve the static invite_client files directly from the Cloud Relay
client_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "Hide-Win-Web", "Guest"))
if os.path.exists(client_dir):
    app.mount("/invite", StaticFiles(directory=client_dir, html=True), name="invite")

