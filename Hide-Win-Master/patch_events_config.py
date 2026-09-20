import re

with open('src/components/app/HideWinAppEvents.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Add configManager import if not there
if "configManager =" not in content:
    content = content.replace("export function bindAppEvents() {", "const configManager = window.require ? window.require('./utils/configManager.js') : require('../../utils/configManager.js');\n\nexport function bindAppEvents() {")

# Replace fetch URL
content = content.replace("'https://app.huddlemate.ai/oauth/token'", "`${configManager.getApiBaseUrl()}/oauth/token`")
content = content.replace("'huddlemate://callback'", "`${configManager.getProtocolName()}://callback`")

with open('src/components/app/HideWinAppEvents.js', 'w', encoding='utf-8') as f:
    f.write(content)
