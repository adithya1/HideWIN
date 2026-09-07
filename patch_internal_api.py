import os
import re

root = r"C:\Users\akula\Downloads\Hide-WIN\hidewin-fastapi\src\api"

admin_files = ["billing", "compliance", "reports", "status_cards", "vendor", "team", "integrations"]
guest_files = ["collaboration", "voice_ws"]
user_files = ["auth", "user", "context", "code_pilot", "resume", "ai_proxy", "stt", "keys", "calendar"]

for dirpath, _, filenames in os.walk(root):
    for f in filenames:
        if f.endswith(".py"):
            path = os.path.join(dirpath, f)
            with open(path, "r", encoding="utf-8") as file:
                content = file.read()
            
            for mod in admin_files:
                content = re.sub(rf"from src\.api\.{mod} import", f"from src.api.admin.{mod} import", content)
            for mod in guest_files:
                content = re.sub(rf"from src\.api\.{mod} import", f"from src.api.guest.{mod} import", content)
            for mod in user_files:
                content = re.sub(rf"from src\.api\.{mod} import", f"from src.api.user.{mod} import", content)
            
            with open(path, "w", encoding="utf-8") as file:
                file.write(content)
            
print("Patched internal api imports!")
