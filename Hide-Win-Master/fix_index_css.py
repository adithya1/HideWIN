file_path = r"c:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\index.html"
with open(file_path, 'r', encoding='utf-8') as f:
    code = f.read()

import re
code = re.sub(r'body\s*\{\s*overflow-x: hidden;\s*background-color: var\(--bg-app\);', r'body {\n                overflow-x: hidden;\n                background-color: transparent !important;', code)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(code)

print("SUCCESS")
