with open('run_api.py', 'r', encoding='utf-8') as f:
    content = f.read()

import_statement = "from src.api.admin import email_templates\n"
content = content.replace("from src.api.user import auth", import_statement + "from src.api.user import auth")

with open('run_api.py', 'w', encoding='utf-8') as f:
    f.write(content)
print("Patched run_api.py imports")
