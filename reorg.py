import os
import shutil

root = r"C:\Users\akula\Downloads\Hide-WIN"
web_dir = os.path.join(root, "Hide-Win-Web")
fastapi_dir = os.path.join(root, "hidewin-fastapi")
relay_dir = os.path.join(root, "hidewin-cloud-relay")

# 1. Create subfolders in Web
admin_dir = os.path.join(web_dir, "Admin")
guest_dir = os.path.join(web_dir, "Guest")
user_dir = os.path.join(web_dir, "User")
os.makedirs(admin_dir, exist_ok=True)
os.makedirs(guest_dir, exist_ok=True)
os.makedirs(user_dir, exist_ok=True)

# 2. Move existing React app in Hide-Win-Web to the User folder
print("Moving React App to Web/User...")
for item in os.listdir(web_dir):
    if item in ["Admin", "Guest", "User"]:
        continue
    src = os.path.join(web_dir, item)
    dst = os.path.join(user_dir, item)
    shutil.move(src, dst)

# 3. Move admin_dashboard from fastapi to Web/Admin
print("Moving Admin UI to Web/Admin...")
old_admin = os.path.join(fastapi_dir, "admin_dashboard")
if os.path.exists(old_admin):
    for item in os.listdir(old_admin):
        shutil.move(os.path.join(old_admin, item), os.path.join(admin_dir, item))
    shutil.rmtree(old_admin)

# 4. Move invite_client from cloud-relay to Web/Guest
print("Moving Guest UI (invite_client) to Web/Guest...")
old_guest = os.path.join(relay_dir, "invite_client")
if os.path.exists(old_guest):
    for item in os.listdir(old_guest):
        shutil.move(os.path.join(old_guest, item), os.path.join(guest_dir, item))
    shutil.rmtree(old_guest)

# Cleanup the duplicate invite_client in fastapi if it exists
old_guest_fastapi = os.path.join(fastapi_dir, "invite_client")
if os.path.exists(old_guest_fastapi):
    shutil.rmtree(old_guest_fastapi)

# 5. Update FastAPI to point to the new Admin UI path
main_py_path = os.path.join(fastapi_dir, "main.py")
if os.path.exists(main_py_path):
    with open(main_py_path, 'r', encoding='utf-8') as f:
        main_py = f.read()
    main_py = main_py.replace('"admin_dashboard"', 'r"../Hide-Win-Web/Admin"')
    with open(main_py_path, 'w', encoding='utf-8') as f:
        f.write(main_py)

# 6. Update Cloud Relay to point to the new Guest UI path
relay_py_path = os.path.join(relay_dir, "cloud_relay.py")
if os.path.exists(relay_py_path):
    with open(relay_py_path, 'r', encoding='utf-8') as f:
        relay_py = f.read()
    
    # We injected os.path.join(os.path.dirname(__file__), "invite_client") earlier
    relay_py = relay_py.replace(
        'os.path.join(os.path.dirname(__file__), "invite_client")', 
        'os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "Hide-Win-Web", "Guest"))'
    )
    with open(relay_py_path, 'w', encoding='utf-8') as f:
        f.write(relay_py)

print("Architecture reorganization complete!")
