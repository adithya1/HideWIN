import re
with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\utils\renderer.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Remove my injected console override block completely
content = re.sub(r'const fs = require\(\'fs\'\);.*?origLog\.apply\(console, args\);\n};\n', '', content, flags=re.DOTALL)

with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\utils\renderer.js', 'w', encoding='utf-8') as f:
    f.write(content)
print("Cleaned up renderer.js")
