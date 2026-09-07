import re

filepath = r"c:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\utils\gemini.js"
with open(filepath, "r", encoding="utf-8") as f:
    content = f.read()

content = content.replace("ws://localhost:8001/ws/transcribe", "ws://localhost:8000/api/stt/stream")

with open(filepath, "w", encoding="utf-8") as f:
    f.write(content)
print("Updated gemini.js")
