import re

# AuthView.js
with open('src/components/views/AuthView.js', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("src=`${pathManager.getAssetPath('images/small_icon.png')}`", "src=\"${pathManager.getAssetPath('images/small_icon.png')}\"")

with open('src/components/views/AuthView.js', 'w', encoding='utf-8') as f:
    f.write(content)

# MainView.js
with open('src/components/views/MainView.js', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("src=`${pathManager.getAssetPath('images/small_icon.png')}`", "src=\"${pathManager.getAssetPath('images/small_icon.png')}\"")

with open('src/components/views/MainView.js', 'w', encoding='utf-8') as f:
    f.write(content)
