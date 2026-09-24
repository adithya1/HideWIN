import re

path = r'c:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\CustomizeView.js'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("Ctrl+Alt+M", "Alt+M")
content = content.replace("Cmd+Alt+M", "Alt+M")

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated CustomizeView.js shortcut label!")
