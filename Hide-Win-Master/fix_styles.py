import re
file_path = r'c:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\app\HideWinApp.styles.js'
with open(file_path, 'r', encoding='utf-8') as f:
    code = f.read()

replacement = """        .app-shell {
            display: flex;
            flex-direction: column;
            height: 100%;
            overflow: hidden;
            background-color: var(--bg-app);
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
            border: 1px solid var(--border);
        }"""

code = re.sub(r'\s*\.app-shell \{[\s\S]*?overflow: hidden;\s*\}', '\n' + replacement, code)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(code)
print("SUCCESS")
