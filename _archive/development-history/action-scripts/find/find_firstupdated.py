import re
with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\InviteView.js', 'r', encoding='utf-8') as f:
    content = f.read()

match = re.search(r'async firstUpdated\(\) \{[\s\S]*?this\.createChannel\(\);(?:\s*\})*', content)
if match:
    print(match.group(0)[-500:])
