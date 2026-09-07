import re
path = r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\ScheduleMeetingView.js'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Verify the CSS block doesn't have an unterminated rule
m = re.search(r'css`(.*?)`', content, re.DOTALL)
if m:
    print(m.group(1)[:100])
