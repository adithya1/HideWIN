import re

filepath = r"c:\Users\akula\Downloads\Hide-WIN\hidewin-fastapi\routers\ai_proxy.py"
with open(filepath, "r", encoding="utf-8") as f:
    content = f.read()

# Replace all backslash-quotes with normal quotes
content = content.replace('\\"', '"')

with open(filepath, "w", encoding="utf-8") as f:
    f.write(content)
print("Fixed ai_proxy.py")
