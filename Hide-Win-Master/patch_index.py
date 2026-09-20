import re

with open('src/index.js', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("const PROTOCOL_NAME = 'huddlemate';", "const configManager = require('./utils/configManager');\nconst PROTOCOL_NAME = configManager.getProtocolName();")

with open('src/index.js', 'w', encoding='utf-8') as f:
    f.write(content)
