path = r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\app\HideWinApp.js'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

import re
m = re.search(r'static styles = css`(.*?)`;\n\n\s*constructor', content, re.DOTALL)
if m:
    with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\dump.css', 'w', encoding='utf-8') as out:
        out.write(m.group(1))
