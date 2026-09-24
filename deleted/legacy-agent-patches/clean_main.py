import os
import re
p = r"C:\Users\akula\Downloads\Hide-WIN - Copy\hidewin-fastapi\main.py"
with open(p, "r", encoding="utf-8") as f:
    text = f.read()

pattern = r'@app\.get\("/api/public/dns-settings"\).*?return \{.*?\}'
match = re.search(pattern, text, re.DOTALL)
if match:
    text = text.replace(match.group(0), "")
    with open(p, "w", encoding="utf-8") as f:
        f.write(text)
    print("Removed broken endpoint from main.py")
