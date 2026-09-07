import re

path = r'C:\Users\akula\Downloads\Hide-WIN\hidewin-fastapi\run_api.py'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

mount_code = r'''
import os
from fastapi.staticfiles import StaticFiles

invite_dir = os.path.join(os.path.dirname(__file__), "invite_client")
if os.path.exists(invite_dir):
    app.mount("/invite", StaticFiles(directory=invite_dir), name="invite")

'''
content += "\n" + mount_code + "\n"

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
