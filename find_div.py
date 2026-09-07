import re
p = r'C:\Users\akula\Downloads\HW-BKP\Hide-Win-Master - Copy 12 - aug - 2026\src\components\app\HideWinApp.js'
with open(p, 'r', encoding='utf-8') as f:
    text = f.read()

for line in text.split('\n'):
    if 'fake-cursor' in line and '<div' in line:
        print(line)
