import re

file_path = r'c:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\utils\renderer.js'
with open(file_path, 'r', encoding='utf-8') as f:
    code = f.read()

# Find the debug setTimeout at the bottom
code = re.sub(r'setTimeout\(\(\) => \{\s*console\.log\("SharedArrayBuffer is:".*?startCapture\(\);\s*\}, 4000\);', '', code, flags=re.DOTALL)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(code)

print("SUCCESS")
