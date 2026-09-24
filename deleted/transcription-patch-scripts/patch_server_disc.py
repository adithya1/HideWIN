import re

filepath = r"c:\Users\akula\Downloads\Hide-WIN\whisper-server\server.py"
with open(filepath, "r", encoding="utf-8") as f:
    content = f.read()

content = content.replace('print("[WS] Client disconnected.")', 'print(f"[WS] Client disconnected. Code: {e.code}, Reason: {e.reason}")')

with open(filepath, "w", encoding="utf-8") as f:
    f.write(content)
