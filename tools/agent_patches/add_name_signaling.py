import os

p = r"C:\Users\akula\Downloads\Hide-WIN - Copy\whisper-server\server.py"
with open(p, "r", encoding="utf-8") as f:
    text = f.read()

# Replace the join route to include the name parameter
old_route = '@app.websocket("/ws/signaling/join/{channel_id}/{token}")'
new_route = '@app.websocket("/ws/signaling/join/{channel_id}/{token}/{name}")'
if old_route in text:
    text = text.replace(old_route, new_route)

old_def = 'async def signaling_join(websocket: WebSocket, channel_id: str, token: str):'
new_def = 'async def signaling_join(websocket: WebSocket, channel_id: str, token: str, name: str):'
if old_def in text:
    text = text.replace(old_def, new_def)

old_send = 'await channel["host"].send_json({"type": "participant_joined", "name": "Guest"})'
new_send = 'await channel["host"].send_json({"type": "participant_joined", "name": name})'
if old_send in text:
    text = text.replace(old_send, new_send)

with open(p, "w", encoding="utf-8") as f:
    f.write(text)
print("Updated server.py to accept participant names")
