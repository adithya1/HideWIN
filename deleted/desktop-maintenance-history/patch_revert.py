import re

# Update src/index.js
with open('src/index.js', 'r', encoding='utf-8') as f:
    content = f.read()
content = content.replace("PROTOCOL_NAME = 'hidewin'", "PROTOCOL_NAME = 'huddlemate'")
with open('src/index.js', 'w', encoding='utf-8') as f:
    f.write(content)

# Update HideWinAppEvents.js
with open('src/components/app/HideWinAppEvents.js', 'r', encoding='utf-8') as f:
    content = f.read()
content = content.replace("http://localhost:5173", "https://app.huddlemate.ai")
content = content.replace("hidewin://", "huddlemate://")
with open('src/components/app/HideWinAppEvents.js', 'w', encoding='utf-8') as f:
    f.write(content)

# Update AuthView.js
with open('src/components/views/AuthView.js', 'r', encoding='utf-8') as f:
    content = f.read()
content = content.replace("http://localhost:5173/oauth/authorize", "https://app.huddlemate.ai/oauth/authorize")
content = content.replace("http://localhost:5173/login", "https://app.huddlemate.ai/signin")
content = content.replace("hidewin://", "huddlemate://")
with open('src/components/views/AuthView.js', 'w', encoding='utf-8') as f:
    f.write(content)

# Update MainView.js
with open('src/components/views/MainView.js', 'r', encoding='utf-8') as f:
    content = f.read()
content = content.replace("hidewin://", "huddlemate://")
content = content.replace("http://localhost:5173/login", "https://app.huddlemate.ai/signin")
with open('src/components/views/MainView.js', 'w', encoding='utf-8') as f:
    f.write(content)

