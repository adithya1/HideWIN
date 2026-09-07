import re

path = r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\app\HideWinApp.js'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("this.currentView = 'invite';", "this.currentView = 'main';")
with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
