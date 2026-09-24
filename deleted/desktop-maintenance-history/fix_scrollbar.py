file_path = r"c:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\app\HideWinApp.js"
with open(file_path, 'r', encoding='utf-8') as f:
    code = f.read()

import re

# Fix scrollbar thumb
code = re.sub(r'::-webkit-scrollbar-thumb\s*\{\s*background:\s*var\(--border-strong\);\s*border-radius:\s*3px;\s*\}', '::-webkit-scrollbar-thumb {\n            background: rgba(150, 150, 150, 0.4) !important;\n            border-radius: 10px;\n        }', code)

code = re.sub(r'::-webkit-scrollbar-thumb:hover\s*\{\s*background:\s*#444444;\s*\}', '::-webkit-scrollbar-thumb:hover {\n            background: rgba(150, 150, 150, 0.6) !important;\n        }', code)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(code)

print("SUCCESS")
