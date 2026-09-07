import re
with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\app\HideWinApp.js', 'r', encoding='utf-8') as f:
    content = f.read()

match = re.search(r"(\w+)\s*\([^)]*\)\s*\{[^}]*case 'active-meeting':", content)
if match:
    print(match.group(1))
