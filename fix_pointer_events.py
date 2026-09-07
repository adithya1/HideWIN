import os
path = r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\sharedPageStyles.js'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace('''        /* Prevent any animation on button text or children */
        button *, .btn * {
            pointer-events: none;
        }''', '')

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
