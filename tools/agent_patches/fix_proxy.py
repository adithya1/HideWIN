import os

p = r"C:\Users\akula\Downloads\Hide-WIN\hidewin-fastapi\routers\ai_proxy.py"
with open(p, "r", encoding="utf-8") as f:
    text = f.read()

text = text.replace("yield f\"\n[Error: {e}]\"", "yield f\"\\n[Error: {e}]\"")

with open(p, "w", encoding="utf-8") as f:
    f.write(text)
print("Fixed syntax error in ai_proxy.py!")
