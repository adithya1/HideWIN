import re

with open('src/utils/renderer.js', 'r', encoding='utf-8') as f:
    text = f.read()
    
match = re.search(r'apply\(themeName, alpha = 0\.8\)\s*\{.*?\n    \},?\n\n', text, re.DOTALL)
if match:
    print(match.group(0)[-500:])
else:
    print("Not found!")
