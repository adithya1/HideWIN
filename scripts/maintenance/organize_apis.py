import os
import shutil
import re

api_dir = r"C:\Users\akula\Downloads\Hide-WIN\hidewin-fastapi\src\api"

admin_dir = os.path.join(api_dir, "admin")
user_dir = os.path.join(api_dir, "user")
guest_dir = os.path.join(api_dir, "guest")

os.makedirs(admin_dir, exist_ok=True)
os.makedirs(user_dir, exist_ok=True)
os.makedirs(guest_dir, exist_ok=True)

# Define groupings
admin_files = ["billing.py", "compliance.py", "reports.py", "status_cards.py", "vendor.py", "team.py", "integrations.py"]
guest_files = ["collaboration.py", "voice_ws.py"]

# Move files
for item in os.listdir(api_dir):
    if item.endswith(".py"):
        src = os.path.join(api_dir, item)
        if item in admin_files:
            shutil.move(src, os.path.join(admin_dir, item))
        elif item in guest_files:
            shutil.move(src, os.path.join(guest_dir, item))
        else:
            # Everything else goes to user
            shutil.move(src, os.path.join(user_dir, item))

# Update run_api.py
run_api = r"C:\Users\akula\Downloads\Hide-WIN\hidewin-fastapi\run_api.py"
with open(run_api, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the single import with targeted imports
new_imports = """from src.api.user import auth, user, context, code_pilot, resume, ai_proxy, stt, keys, calendar
from src.api.admin import vendor, billing, team, status_cards, reports, compliance, integrations
from src.api.guest import collaboration, voice_ws
"""
content = re.sub(r'from src\.api import.*?\n', new_imports, content, flags=re.DOTALL)
# Make sure admin is removed from include_router since it doesn't exist
content = re.sub(r'app\.include_router\(admin\.router\)\n', '', content)

with open(run_api, 'w', encoding='utf-8') as f:
    f.write(content)
print("Organized API into admin/user/guest folders.")
