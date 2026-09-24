import os

p = r"C:\Users\akula\Downloads\Hide-WIN - Copy\hidewin-fastapi\main.py"
with open(p, "r", encoding="utf-8") as f:
    text = f.read()

text = text.replace('allow_origins=["http://localhost:5173", "http://127.0.0.1:5173", "file://", "app://.", "http://localhost:3000", "http://localhost:8000"],', 'allow_origins=["http://localhost:5173", "http://127.0.0.1:5173", "file://", "app://.", "http://localhost:3000", "http://localhost:8000", "null"],\n    allow_origin_regex=".*",')

with open(p, "w", encoding="utf-8") as f:
    f.write(text)
print("Added allow_origin_regex to fix CORS for null origin!")
