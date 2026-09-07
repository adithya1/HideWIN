import re

path = r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\app\HideWinApp.js'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("this.currentView = 'main';", "this.currentView = 'invite';")
content = content.replace("this.currentView = config.onboarded ? 'main' : 'onboarding';", "this.currentView = 'invite';")
with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
