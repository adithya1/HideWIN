import re

fpath = 'src/components/views/MainView.js'
with open(fpath, 'r', encoding='utf-8') as f:
    content = f.read()

# Change max-width: 750px to max-width: 650px
content = content.replace('@media (max-width: 750px)', '@media (max-width: 680px)')

with open(fpath, 'w', encoding='utf-8') as f:
    f.write(content)
