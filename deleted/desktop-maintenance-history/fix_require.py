import re

file_path = r'c:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\app\HideWinApp.js'
with open(file_path, 'r', encoding='utf-8') as f:
    code = f.read()

code = code.replace("const fs = require('fs');", "const fs = window.require ? window.require('fs') : null;")
code = code.replace("fs.appendFileSync", "if(fs) fs.appendFileSync")

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(code)

print("SUCCESS")
