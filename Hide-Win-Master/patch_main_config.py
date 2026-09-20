import re

with open('src/components/views/MainView.js', 'r', encoding='utf-8') as f:
    content = f.read()

if "configManager =" not in content:
    content = content.replace("export class MainView extends LitElement {", "const configManager = window.require ? window.require('./utils/configManager.js') : require('../../utils/configManager.js');\n\nexport class MainView extends LitElement {")

# It had: const loginUrl = 'https://app.huddlemate.ai/signin?redirect_uri=huddlemate://callback';
old_login = r"const loginUrl = 'https://app\.huddlemate\.ai/signin\?redirect_uri=huddlemate://callback';"
new_login = "const loginUrl = `${configManager.getWebBaseUrl()}/login?redirect_uri=${configManager.getProtocolName()}://callback`;"

content = re.sub(old_login, new_login, content)

with open('src/components/views/MainView.js', 'w', encoding='utf-8') as f:
    f.write(content)
