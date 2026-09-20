import re

with open('src/components/views/AuthView.js', 'r', encoding='utf-8') as f:
    content = f.read()

if "configManager =" not in content:
    content = content.replace("export class AuthView extends LitElement {", "const configManager = window.require ? window.require('./utils/configManager.js') : require('../../utils/configManager.js');\n\nexport class AuthView extends LitElement {")

content = content.replace("const redirectUri = 'huddlemate://callback';", "const redirectUri = `${configManager.getProtocolName()}://callback`;")

# Fix URLs
content = re.sub(r'`https://app\.huddlemate\.ai/oauth/authorize\?response_type=code', r'`${configManager.getWebBaseUrl()}/oauth/authorize?response_type=code', content)

content = re.sub(r'`https://app\.huddlemate\.ai/signin\?login_hint=\$\{encodeURIComponent\(this\.email\)\}&returnUrl=\$\{encodeURIComponent\(authorizeUrl\)\}`', r'`${configManager.getWebBaseUrl()}/login?login_hint=${encodeURIComponent(this.email)}&returnUrl=${encodeURIComponent(authorizeUrl)}`', content)

content = re.sub(r'`https://app\.huddlemate\.ai/signin\?returnUrl=\$\{encodeURIComponent\(authorizeUrl\)\}`', r'`${configManager.getWebBaseUrl()}/login?returnUrl=${encodeURIComponent(authorizeUrl)}`', content)

with open('src/components/views/AuthView.js', 'w', encoding='utf-8') as f:
    f.write(content)
