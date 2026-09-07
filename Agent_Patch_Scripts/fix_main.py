import os

p = r"C:\Users\akula\Downloads\Hide-WIN - Copy\hidewin-fastapi\main.py"
with open(p, "r", encoding="utf-8") as f:
    text = f.read()

# Fix the missing import
old_import = "from routers import auth, admin, vendor, billing, user, team, status_cards, reports, context, compliance, integrations, code_pilot, resume, ai_proxy, stt, keys"
new_import = "from routers import auth, admin, vendor, billing, user, team, status_cards, reports, context, compliance, integrations, code_pilot, resume, ai_proxy, stt, keys, voice_ws"

if old_import in text:
    text = text.replace(old_import, new_import)
    with open(p, "w", encoding="utf-8") as f:
        f.write(text)
    print("Fixed missing import voice_ws in main.py")
else:
    print("Could not find exact import string to replace.")
