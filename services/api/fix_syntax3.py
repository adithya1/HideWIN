import re

filepath = r"c:\Users\akula\Downloads\Hide-WIN\hidewin-fastapi\routers\ai_proxy.py"
with open(filepath, "r", encoding="utf-8") as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if "elif \"llama\" in model_val or \"gsk\" in model_val or \"mixtral\" in model_val:" in line:
        pass # It's correct if we already fixed it?
    if 'elif "llama" in model_val or "gsk" in model_val or "mixtral" in model_val:' in line:
        pass
    
    # Let's just fix line 128
    if "yield f\"data: {{\"error\":" in line:
        lines[i] = "                    yield f\"data: {{\\\"error\\\": \\\"Google API Error: {response.status_code} {error_text.decode('utf-8', errors='ignore')}\\\"}}\\n\\n\"\n"
        
with open(filepath, "w", encoding="utf-8") as f:
    f.writelines(lines)
print("Fixed ai_proxy.py")
