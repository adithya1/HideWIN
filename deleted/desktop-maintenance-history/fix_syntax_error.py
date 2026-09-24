import re

# MainView.js
with open('src/components/views/MainView.js', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(r"url('${pathManager.getAssetPath(\'images/media_1786601281073.png\')}')", r"url('${pathManager.getAssetPath('images/media_1786601281073.png')}')")
content = content.replace(r"url('${pathManager.getAssetPath(\'images/media_1786601281022.png\')}')", r"url('${pathManager.getAssetPath('images/media_1786601281022.png')}')")
content = content.replace(r"`${pathManager.getAssetPath(\'images/small_icon.png\')}`", r"`${pathManager.getAssetPath('images/small_icon.png')}`")

with open('src/components/views/MainView.js', 'w', encoding='utf-8') as f:
    f.write(content)

# AuthView.js
with open('src/components/views/AuthView.js', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(r"`${pathManager.getAssetPath(\'images/small_icon.png\')}`", r"`${pathManager.getAssetPath('images/small_icon.png')}`")

with open('src/components/views/AuthView.js', 'w', encoding='utf-8') as f:
    f.write(content)
