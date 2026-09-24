import os
import re

p = r"C:\Users\akula\Downloads\Hide-WIN - Copy\hidewin-fastapi\main.py"
with open(p, "r", encoding="utf-8") as f:
    text = f.read()

# The block I injected starts with "import uuid" and ends with "app.mount("/invite", ...)"
# But wait, there is already "import uuid" maybe?
# Let's extract the block I injected. I injected it at the end.
lines = text.splitlines()

# Find where my injection started. I know I injected:
# import uuid
# import json
# from fastapi import WebSocket, WebSocketDisconnect
# channels = {}
# @app.websocket("/ws/signaling/host/{channel_id}")

start_idx = -1
for i, line in enumerate(lines):
    if "channels = {}" in line:
        # Check if next line is @app.websocket
        if i + 2 < len(lines) and "@app.websocket" in lines[i+2]:
            start_idx = i - 3  # import uuid
            break

if start_idx != -1:
    injected_block = lines[start_idx:]
    clean_text = "\n".join(lines[:start_idx])
    
    # Now find where to safely inject it: before app.mount("/")
    # Let's inject it right before "# "?"? Serve static public files "?"?"
    
    inject_point = clean_text.find("# ??? Serve static public files ???")
    if inject_point == -1:
        # fallback if encoding is weird
        inject_point = clean_text.find("public_dir = os.path.join")
        
    if inject_point != -1:
        # move backwards to previous line
        inject_point = clean_text.rfind('\n', 0, inject_point)
        
        final_text = clean_text[:inject_point] + "\n\n" + "\n".join(injected_block) + "\n\n" + clean_text[inject_point:]
        
        with open(p, "w", encoding="utf-8") as f:
            f.write(final_text)
        print("Moved WebRTC block before StaticFiles!")
    else:
        print("Could not find injection point")
else:
    print("Could not find injected block")
