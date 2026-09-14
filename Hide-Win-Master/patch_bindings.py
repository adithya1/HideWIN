import re

fpath = r'c:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\AuthView.js'
with open(fpath, 'r', encoding='utf-8') as f:
    content = f.read()

# Fix event bindings
content = re.sub(r'@([a-z-]+)="(\$\{[^\}]+\})"', r'@\1=\2', content)

# Fix property bindings
content = re.sub(r'\.([a-zA-Z-]+)="(\$\{[^\}]+\})"', r'.\1=\2', content)

# Fix boolean bindings
content = re.sub(r'\?([a-zA-Z-]+)="(\$\{[^\}]+\})"', r'?\1=\2', content)

with open(fpath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Fixed LitElement bindings syntax.")
