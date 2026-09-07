import os
root = r"C:\Users\akula\Downloads\Hide-WIN\hidewin-fastapi"
for dirpath, _, filenames in os.walk(root):
    for f in filenames:
        if f.endswith(".py"):
            path = os.path.join(dirpath, f)
            with open(path, "r", encoding="utf-8") as file:
                content = file.read()
            if "src.models.models" in content:
                content = content.replace("from src.models.models import", "from db_models import")
                content = content.replace("import src.models.models as models", "import db_models as models")
                content = content.replace("import src.models.models", "import db_models")
                with open(path, "w", encoding="utf-8") as file:
                    file.write(content)
                print(f"Patched {path}")
