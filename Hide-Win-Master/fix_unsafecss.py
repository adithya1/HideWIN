import re

with open('src/components/views/MainView.js', 'r', encoding='utf-8') as f:
    content = f.read()

if "unsafeCSS" not in content:
    content = content.replace("import { html, css, LitElement }", "import { html, css, LitElement, unsafeCSS }")

content = content.replace("url('${pathManager.getAssetPath('images/media_1786601281073.png')}')", "url('${unsafeCSS(pathManager.getAssetPath('images/media_1786601281073.png'))}')")
content = content.replace("url('${pathManager.getAssetPath('images/media_1786601281022.png')}')", "url('${unsafeCSS(pathManager.getAssetPath('images/media_1786601281022.png'))}')")

with open('src/components/views/MainView.js', 'w', encoding='utf-8') as f:
    f.write(content)
