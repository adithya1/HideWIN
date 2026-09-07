import re
with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\storage.js', 'r', encoding='utf-8') as f:
    content = f.read()

match = re.search(r'function getConfigDir\(\) \{[\s\S]*?\}', content)
if match:
    print(match.group(0))
