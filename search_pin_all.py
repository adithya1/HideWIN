import os
import re

backup_dir = r'C:\Users\akula\Downloads\HW-BKP\Hide-Win-Master - Copy (4)\src'
for root, dirs, files in os.walk(backup_dir):
    for f in files:
        if f.endswith('.js') or f.endswith('.html'):
            path = os.path.join(root, f)
            with open(path, 'r', encoding='utf-8', errors='ignore') as file:
                content = file.read()
                matches = list(re.finditer(r'.{0,40}\bpin\b.{0,40}', content, re.IGNORECASE))
                if matches:
                    print(f"--- {f} ---")
                    for m in matches:
                        print(m.group(0))
