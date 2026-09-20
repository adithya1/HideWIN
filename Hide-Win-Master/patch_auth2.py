import re

with open('src/components/views/AuthView.js', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    "height: 48px;\n            -webkit-app-region: drag;",
    "height: 48px;\n            right: 140px;\n            -webkit-app-region: drag;"
)

with open('src/components/views/AuthView.js', 'w', encoding='utf-8') as f:
    f.write(content)
