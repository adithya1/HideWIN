import re

path = r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\InviteView.js'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("'hidewin.com:9000'", "'127.0.0.1:8000'")
content = content.replace("'127.0.0.1:9000'", "'127.0.0.1:8000'")

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
