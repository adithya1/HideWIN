import re

filepath = r"c:\Users\akula\Downloads\Hide-WIN\hidewin-fastapi\routers\ai_proxy.py"
with open(filepath, "r", encoding="utf-8") as f:
    lines = f.readlines()

for i in range(len(lines)):
    if "Groq API Error" in lines[i]:
        lines[i] = '                        yield f"data: {{\\"error\\": \\"Groq API Error: {response.status_code}\\"}}\\n\\n"\n'

with open(filepath, "w", encoding="utf-8") as f:
    f.writelines(lines)
