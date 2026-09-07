import os
import re

root = r"C:\Users\akula\Downloads\Hide-WIN\hidewin-fastapi\src\api"

for dirpath, _, filenames in os.walk(root):
    for f in filenames:
        if f.endswith(".py"):
            path = os.path.join(dirpath, f)
            with open(path, "r", encoding="utf-8") as file:
                content = file.read()
            
            # Fix models import
            content = content.replace("import db_models as models, schemas", "import db_models as models\nimport src.schemas.schemas as schemas")
            content = content.replace("import db_models as models, src.schemas.schemas as schemas", "import db_models as models\nimport src.schemas.schemas as schemas")
            
            with open(path, "w", encoding="utf-8") as file:
                file.write(content)
            
print("Patched schemas imports!")
