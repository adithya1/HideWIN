import os
import shutil

run_api = r"C:\Users\akula\Downloads\Hide-WIN\hidewin-fastapi\run_api.py"
with open(run_api, 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("from routers import", "from src.api import")
content = content.replace("db_models", "src.models.models") # Fixing the old db_models reference just in case

with open(run_api, 'w', encoding='utf-8') as f:
    f.write(content)
print("Patched run_api.py")
