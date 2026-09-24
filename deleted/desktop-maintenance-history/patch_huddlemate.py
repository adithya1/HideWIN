import re

# Update src/index.js
with open('src/index.js', 'r', encoding='utf-8') as f:
    content = f.read()
content = content.replace("PROTOCOL_NAME = 'huddlemate'", "PROTOCOL_NAME = 'hidewin'")
with open('src/index.js', 'w', encoding='utf-8') as f:
    f.write(content)

# Update HideWinAppEvents.js
with open('src/components/app/HideWinAppEvents.js', 'r', encoding='utf-8') as f:
    content = f.read()
content = content.replace("https://app.huddlemate.ai", "http://localhost:5173")
content = content.replace("huddlemate://", "hidewin://")
with open('src/components/app/HideWinAppEvents.js', 'w', encoding='utf-8') as f:
    f.write(content)

# Update AuthView.js
with open('src/components/views/AuthView.js', 'r', encoding='utf-8') as f:
    content = f.read()
content = content.replace("https://app.huddlemate.ai/oauth/authorize", "http://localhost:5173/oauth/authorize")
content = content.replace("https://app.huddlemate.ai/signin", "http://localhost:5173/signin")
content = content.replace("huddlemate://", "hidewin://")
with open('src/components/views/AuthView.js', 'w', encoding='utf-8') as f:
    f.write(content)

# Update MainView.js
with open('src/components/views/MainView.js', 'r', encoding='utf-8') as f:
    content = f.read()
content = content.replace("huddlemate://", "hidewin://")
with open('src/components/views/MainView.js', 'w', encoding='utf-8') as f:
    f.write(content)

