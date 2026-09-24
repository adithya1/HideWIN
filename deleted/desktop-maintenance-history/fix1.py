import re

file_path = r'c:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\app\HideWinApp.js'
with open(file_path, 'r', encoding='utf-8') as f:
    code = f.read()

# Remove isMainWindowMinimized block
code = re.sub(r'// Enforce Minimized Widget First.*?if \(this\.isMainWindowMinimized\) \{.*?return html`.*?</div>\s*</div>\s*`;\s*\}\s*', '', code, flags=re.DOTALL)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(code)

print("SUCCESS")
