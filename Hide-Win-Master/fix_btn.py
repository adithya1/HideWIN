import re

with open('src/components/views/MainView.js', 'r', encoding='utf-8') as f:
    code = f.read()

code = code.replace('.action-bar-pill > div {', '.action-bar-pill > div, .action-bar-pill > button {')

with open('src/components/views/MainView.js', 'w', encoding='utf-8') as f:
    f.write(code)
