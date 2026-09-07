import os

p = r"C:\Users\akula\Downloads\Hide-WIN - Copy\hidewin-fastapi\routers\ai_proxy.py"
with open(p, "r", encoding="utf-8") as f:
    text = f.read()

# Fix the broken f-string
# Looks like: yield f"\n[Error: {e}]" but with an actual newline inside the string
text = text.replace("yield f\"\n[Error: {e}]\"", "yield f\"\\n[Error: {e}]\"")
text = text.replace("yield f\"\r\n[Error: {e}]\"", "yield f\"\\n[Error: {e}]\"")

with open(p, "w", encoding="utf-8") as f:
    f.write(text)
print("Fixed f-string literal")
