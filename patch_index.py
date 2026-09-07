import re
with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\index.html', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("body, html, * {", "html, body {\n                width: 100%;\n                height: 100%;\n            }\n            body, html, * {")

with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\index.html', 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated index.html")
