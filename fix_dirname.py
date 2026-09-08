import re

filepath = r"Hide-Win-Master\src\utils\renderer.js"
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# I will log __dirname to see what it is
content = content.replace(
    "console.log('Initializing Silero VAD...');",
    "console.log('Initializing Silero VAD...');\n    console.log('__dirname is:', typeof __dirname !== 'undefined' ? __dirname : 'undefined');"
)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
