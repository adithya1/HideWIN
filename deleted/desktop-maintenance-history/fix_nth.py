import re

fpath = 'src/components/views/MainView.js'
with open(fpath, 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace('.action-dropdown:nth-child(3)', '.action-dropdown:nth-child(2)')

with open(fpath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated nth-child selectors.")
