import re

filepath = r"Hide-Win-Master\src\utils\window.shortcuts.js"
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# find all undeclared assignments like lockerProcess =
lines = content.split('\n')
for i, line in enumerate(lines):
    if '=' in line and '==' not in line:
        pass
