import re

path = r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\utils\window.js'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("blockerProcess.stdin.write('EXIT\n');", "blockerProcess.stdin.write('EXIT\\n');")

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
