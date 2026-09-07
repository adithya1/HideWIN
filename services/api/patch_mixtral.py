import re

filepath = r"c:\Users\akula\Downloads\Hide-WIN\hidewin-fastapi\routers\ai_proxy.py"
with open(filepath, "r", encoding="utf-8") as f:
    content = f.read()

target = r"elif \"llama\" in model_val or \"gsk\" in model_val:"
replacement = r"elif \"llama\" in model_val or \"gsk\" in model_val or \"mixtral\" in model_val:"

content = re.sub(target, replacement, content)

with open(filepath, "w", encoding="utf-8") as f:
    f.write(content)
print("Patched ai_proxy.py to include mixtral")
