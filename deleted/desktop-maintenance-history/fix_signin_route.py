import re

with open('src/components/views/AuthView.js', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("/login?login_hint", "/signin?login_hint")
content = content.replace("/login?returnUrl", "/signin?returnUrl")

with open('src/components/views/AuthView.js', 'w', encoding='utf-8') as f:
    f.write(content)
