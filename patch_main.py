import re
with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\MainView.js', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("width: 100vw !important;", "width: 100% !important;")
content = content.replace("height: 100vh !important;", "height: 100% !important;")

with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\MainView.js', 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated MainView.js")
