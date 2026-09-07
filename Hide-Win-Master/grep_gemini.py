import re
with open("src/utils/gemini.js", "r", encoding="utf-8") as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if "fetch" in line or "streamGenerateContent" in line or "generateContent" in line:
        print(f"[{i+1}] {line.strip()}")
