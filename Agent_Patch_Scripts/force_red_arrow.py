import re

path = r'c:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\utils\window.js'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Force the cursor to be a red arrow
content = content.replace("const cFill = style === 'arrow' ? 'red' : 'black';", "const cFill = 'red';")
content = content.replace("const tFill = style === 'arrow' ? 'red' : 'black';", "const tFill = 'red';")
content = content.replace("const tStroke = style === 'arrow' ? 'red' : 'white';", "const tStroke = 'white';")

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
print("Forced red arrow cursor!")
