import re

path = 'src/components/views/HistoryView.js'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace('flex: 1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;', 'margin-left: 16px; margin-right: 16px;')

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Fixed flex in HistoryView")
