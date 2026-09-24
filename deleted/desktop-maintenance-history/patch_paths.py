import re

# AuthView.js
file_path = 'src/components/views/AuthView.js'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

if "pathManager =" not in content:
    content = content.replace("export class AuthView extends LitElement {", "const pathManager = window.require ? window.require('./utils/pathManager.js') : require('../../utils/pathManager.js');\n\nexport class AuthView extends LitElement {")

content = content.replace('"./assets/images/small_icon.png"', '`${pathManager.getAssetPath(\'images/small_icon.png\')}`')
with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

# MainView.js
file_path = 'src/components/views/MainView.js'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

if "pathManager =" not in content:
    content = content.replace("export class MainView extends LitElement {", "const pathManager = window.require ? window.require('./utils/pathManager.js') : require('../../utils/pathManager.js');\n\nexport class MainView extends LitElement {")

content = content.replace("url('./assets/images/media_1786601281073.png')", "url('${pathManager.getAssetPath(\\'images/media_1786601281073.png\\')}')")
content = content.replace("url('./assets/images/media_1786601281022.png')", "url('${pathManager.getAssetPath(\\'images/media_1786601281022.png\\')}')")
content = content.replace('"./assets/images/small_icon.png"', '`${pathManager.getAssetPath(\'images/small_icon.png\')}`')
with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

