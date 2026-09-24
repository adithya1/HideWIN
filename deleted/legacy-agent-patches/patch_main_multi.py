import re

path = r'C:\Users\akula\Downloads\Hide-WIN - Copy\hidewin-fastapi\main.py'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update signaling_host
old_host = """@app.websocket("/ws/signaling/host/{channel_id}")
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
            
            elif msg["type"] in ["ice_candidate", "candidate", "offer", "answer", "ai_answer", "transcript"]:
                if channels[channel_id]["participant"]:
                    await channels[channel_id]["participant"].send_json(msg)

    except WebSocketDisconnect:
        del channels[channel_id]"""

new_host = """@app.websocket("/ws/signaling/host/{channel_id}")
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
        del channels[channel_id]"""

# 2. Update signaling_join
old_join = """@app.websocket("/ws/signaling/join/{channel_id}/{token}/{name}")
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
            
            if msg["type"] in ["ice_candidate", "candidate"] or msg["type"] == "offer" or msg["type"] == "answer":
                await channels[channel_id]["host"].send_json(msg)
                
    except WebSocketDisconnect:
        channels[channel_id]["participant"] = None
        await channels[channel_id]["host"].send_json({"type": "participant_left"})"""

new_join = """@app.websocket("/ws/signaling/join/{channel_id}/{token}/{name}")
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
            
            # Inject source ID so the Host knows which peer connection this belongs to
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
            pass"""

if old_host in content and old_join in content:
    content = content.replace(old_host, new_host)
    content = content.replace(old_join, new_join)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Patched main.py successfully!")
else:
    print("Could not find blocks to patch in main.py")
    
    # Let's try regex just in case
    if "async def signaling_host" in content:
        print("Using regex fallback...")
        content = re.sub(r'@app\.websocket\("/ws/signaling/host/\{channel_id\}"\).*?except WebSocketDisconnect:\s*del channels\[channel_id\]', new_host, content, flags=re.DOTALL)
        content = re.sub(r'@app\.websocket\("/ws/signaling/join/\{channel_id\}/\{token\}/\{name\}"\).*?await channels\[channel_id\]\["host"\]\.send_json\(\{"type": "participant_left"\}\)', new_join, content, flags=re.DOTALL)
        with open(path, 'w', encoding='utf-8') as f:
            f.write(content)
        print("Patched main.py via Regex!")
