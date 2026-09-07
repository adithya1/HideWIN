import re
with open(r'C:\Users\akula\Downloads\Hide-WIN\hidewin-fastapi\run_api.py', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the while True loop in signaling_host
new_host_loop = """        while True:
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
                        pass"""

# The regex should match the try block inside signaling_host
content = re.sub(
    r'while True:\s*data = await websocket\.receive_text\(\)\s*msg = json\.loads\(data\).*?except WebSocketDisconnect:',
    new_host_loop + '\n\n    except WebSocketDisconnect:',
    content,
    flags=re.DOTALL
)

with open(r'C:\Users\akula\Downloads\Hide-WIN\hidewin-fastapi\run_api.py', 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated run_api.py")
