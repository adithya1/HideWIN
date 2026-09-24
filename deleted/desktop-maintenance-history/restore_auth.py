import re

with open('src/components/views/AuthView.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Add configManager and pathManager imports
imports = """
const configManager = window.require ? window.require('./utils/configManager.js') : require('../../utils/configManager.js');
const pathManager = window.require ? window.require('./utils/pathManager.js') : require('../../utils/pathManager.js');

export class AuthView extends LitElement {
"""
content = content.replace("export class AuthView extends LitElement {", imports)

# Replace localhost with configManager
content = content.replace("'http://localhost:8000/auth/send-otp'", "`${configManager.getApiBaseUrl()}/auth/send-otp`")
content = content.replace("'http://localhost:8000/auth/login'", "`${configManager.getApiBaseUrl()}/auth/login`")
content = content.replace("`http://localhost:8000/auth/sso/${provider.toLowerCase()}/login`", "`${configManager.getApiBaseUrl()}/auth/sso/${provider.toLowerCase()}/login`")

# Replace hardcoded image paths
content = content.replace('src="./assets/images/small_icon.png"', 'src="${pathManager.getAssetPath(\'images/small_icon.png\')}"')
content = content.replace('src="./assets/images/media_1786601281073.png"', 'src="${pathManager.getAssetPath(\'images/media_1786601281073.png\')}"')
content = content.replace('src="./assets/images/media_1786601281022.png"', 'src="${pathManager.getAssetPath(\'images/media_1786601281022.png\')}"')
content = content.replace("url('./assets/images/media_1786601281073.png')", "url('${unsafeCSS(pathManager.getAssetPath(\\'images/media_1786601281073.png\\'))}')")
content = content.replace("url('./assets/images/media_1786601281022.png')", "url('${unsafeCSS(pathManager.getAssetPath(\\'images/media_1786601281022.png\\'))}')")

# Make sure we import unsafeCSS if it's used
if "unsafeCSS" not in content and "url('${unsafeCSS" in content:
    content = content.replace("import { html, css, LitElement }", "import { html, css, LitElement, unsafeCSS }")

with open('src/components/views/AuthView.js', 'w', encoding='utf-8') as f:
    f.write(content)
