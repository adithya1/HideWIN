import glob
import re

files = glob.glob(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\*.js')
files.append(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\app\HideWinApp.js')

for path in files:
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    if "css`" in content and "* { box-sizing: border-box; }" not in content and "box-sizing: border-box" not in content[:500]:
        # Inject just after css`
        content = content.replace("css`", "css`\n            * { box-sizing: border-box; }\n", 1)
        with open(path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Injected into {path}")

