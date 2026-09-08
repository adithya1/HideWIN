import re
import sys

filepath = r"Hide-Win-Master\src\utils\window.shortcuts.js"
with open(filepath, 'r', encoding='utf-8') as f:
    code = f.read()

# very naive approach: find all words on the left side of = that are not preceded by let, const, var
lines = code.split('\n')
for i, line in enumerate(lines):
    line = line.strip()
    match = re.match(r'^([a-zA-Z0-9_]+)\s*=', line)
    if match:
        var_name = match.group(1)
        print(f"Line {i+1}: {var_name}")
