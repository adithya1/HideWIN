import re

path = r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\utils\window.js'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

content = re.sub(r'setTimeout\(\(\) => \{\s*console\.log\(\'SIMULATING ALT\+A.*?\}, 5000\);', '', content, flags=re.DOTALL)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
print("Removed simulation timeout!")
