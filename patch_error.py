import re

path = r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\InviteView.js'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("Is the Relay running on port 9000?", "Is the API running on port 8000?")
with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
