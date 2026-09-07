import re
import os
import shutil

# 1. Update main.py to restore admin API
path = 'main.py'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Add admin back to import
content = re.sub(r"from routers import auth,vendor", "from routers import auth, admin, vendor", content)

# Add include_router
content = re.sub(r"app\.include_router\(auth\.router\)\n", "app.include_router(auth.router)\napp.include_router(admin.router)\n", content)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)

# 2. Delete public/admin UI
if os.path.exists('public/admin'):
    shutil.rmtree('public/admin')

print("Restored admin API endpoints and removed FastAPI admin UI")
