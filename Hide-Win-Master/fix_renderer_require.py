import re

# renderer.js
with open('src/utils/renderer.js', 'r', encoding='utf-8') as f:
    content = f.read()
content = content.replace("window.require('./configManager.js')", "window.require('./utils/configManager.js')")
with open('src/utils/renderer.js', 'w', encoding='utf-8') as f:
    f.write(content)
