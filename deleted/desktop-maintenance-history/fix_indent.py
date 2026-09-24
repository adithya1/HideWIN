import re

file_path = r'C:\Users\akula\Downloads\Hide-WIN\services\api\routers\ai_proxy.py'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("    audio_bytes = await file.read()\n        stt_model = request.headers.get(\"X-STT-Model\")", "    audio_bytes = await file.read()\n    stt_model = request.headers.get(\"X-STT-Model\")")

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
