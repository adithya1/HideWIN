import os
import shutil
import re

root = r"C:\Users\akula\Downloads\Hide-WIN\hidewin-fastapi"
src_dir = os.path.join(root, "src")
api_dir = os.path.join(src_dir, "api")
models_dir = os.path.join(src_dir, "models")
schemas_dir = os.path.join(src_dir, "schemas")
lib_dir = os.path.join(src_dir, "lib")
utils_dir = os.path.join(src_dir, "utils")

# Create structure
for d in [api_dir, models_dir, schemas_dir, lib_dir, utils_dir]:
    os.makedirs(d, exist_ok=True)

# 1. Move files
moves = [
    ("models.py", os.path.join(models_dir, "models.py")),
    ("schemas.py", os.path.join(schemas_dir, "schemas.py")),
    ("database.py", os.path.join(lib_dir, "database.py"))
]

for file, dest in moves:
    src_file = os.path.join(root, file)
    if os.path.exists(src_file):
        shutil.move(src_file, dest)

# 2. Move routers to api/
old_routers = os.path.join(root, "routers")
if os.path.exists(old_routers):
    for item in os.listdir(old_routers):
        if item.endswith(".py"):
            shutil.move(os.path.join(old_routers, item), os.path.join(api_dir, item))
    shutil.rmtree(old_routers)

# 3. Move old utils to src/utils
old_utils = os.path.join(root, "utils")
if os.path.exists(old_utils):
    for item in os.listdir(old_utils):
        if item.endswith(".py"):
            shutil.move(os.path.join(old_utils, item), os.path.join(utils_dir, item))
    shutil.rmtree(old_utils)

# 4. Rename main.py to run_api.py
main_file = os.path.join(root, "main.py")
run_api = os.path.join(root, "run_api.py")
if os.path.exists(main_file):
    shutil.move(main_file, run_api)

# --- REWRITE IMPORTS ---
# We need to search and replace import statements in all .py files in src/ and run_api.py

def patch_imports(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Replacements
    replacements = [
        (r'from models import', r'from src.models.models import'),
        (r'import models\b', r'import src.models.models as models'),
        (r'from schemas import', r'from src.schemas.schemas import'),
        (r'import schemas\b', r'import src.schemas.schemas as schemas'),
        (r'from database import', r'from src.lib.database import'),
        (r'import database\b', r'import src.lib.database as database'),
        (r'from routers\.', r'from src.api.'),
        (r'from utils\.', r'from src.utils.'),
        (r'"public"', r'"../Hide-Win-Web/Admin"') # Update the main.py static mount just in case
    ]

    new_content = content
    for pattern, repl in replacements:
        new_content = re.sub(pattern, repl, new_content)

    if new_content != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Patched imports in {filepath}")

# Patch run_api.py
if os.path.exists(run_api):
    patch_imports(run_api)

# Patch all files in src
for dirpath, _, filenames in os.walk(src_dir):
    for file in filenames:
        if file.endswith(".py"):
            patch_imports(os.path.join(dirpath, file))

print("Backend Restructuring Complete!")
