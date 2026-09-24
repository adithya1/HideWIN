import os
import re

p = r"C:\Users\akula\Downloads\Hide-WIN - Copy\hidewin-fastapi\main.py"
with open(p, "r", encoding="utf-8") as f:
    text = f.read()

# The dangling code starts after:
# @app.get("/health")
# def health():
#     return {"status": "ok"}

# We can safely delete everything after this function, except we need to keep `import uuid` AT THE TOP of the file.
text = re.sub(r'(@app\.get\("/health"\)\s*def health\(\):\s*return \{"status": "ok"\}\s*)([\s\S]*)', r'\1', text)

# Ensure uuid is imported at the top
if 'import uuid' not in text:
    text = "import uuid\n" + text

with open(p, "w", encoding="utf-8") as f:
    f.write(text)
print("Cleaned up dangling code in main.py!")
