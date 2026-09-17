file_path = r"c:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\app\HideWinApp.js"
with open(file_path, 'r', encoding='utf-8') as f:
    code = f.read()

import re
code = re.sub(r'(static properties = \{)', r'\1\n        showAvatarMenu: { type: Boolean },', code)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(code)

print("SUCCESS")
