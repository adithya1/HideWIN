import re
run_api = r"C:\Users\akula\Downloads\Hide-WIN\hidewin-fastapi\run_api.py"
with open(run_api, "r", encoding="utf-8") as f:
    content = f.read()

# Replace src.models.models.base with db_models.base
content = content.replace("from src.models.models.base import Base", "from db_models.base import Base")
content = content.replace("import src.models.models", "import db_models")

with open(run_api, "w", encoding="utf-8") as f:
    f.write(content)
print("Patched run_api.py models import!")
