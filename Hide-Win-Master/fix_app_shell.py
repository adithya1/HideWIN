file_path = r"c:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\app\HideWinApp.js"
with open(file_path, 'r', encoding='utf-8') as f:
    code = f.read()

import re
code = re.sub(r'(\n\s*\.app-shell\s*\{\s*display: flex;\s*flex-direction: column;\s*height: 100%;\s*overflow: hidden;)', r'\1\n            background: var(--bg-app);\n            border: 3px solid var(--border);\n            border-radius: 8px;\n            box-sizing: border-box;', code)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(code)

print("SUCCESS")
