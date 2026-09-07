import re

path = 'src/components/views/sharedPageStyles.js'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Fix .notes-btn.primary text color
content = content.replace('color: var(--bg-elevated);', 'color: #ffffff;')

# Also add nice transition to .notes-btn
if 'transition: all 0.3s cubic-bezier' not in content:
    content = content.replace('.notes-btn.primary {', '.notes-btn.primary {\n        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);')

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Fixed button text color and hover animations in sharedPageStyles.")
