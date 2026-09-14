import re

fpath = r'c:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\index.js'
with open(fpath, 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace('// mainWindow.webContents.openDevTools();', 'mainWindow.webContents.openDevTools();')
if 'openDevTools' not in content:
    content = content.replace('mainWindow.loadFile(', 'mainWindow.webContents.openDevTools();\\n    mainWindow.loadFile(')

with open(fpath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Added openDevTools to index.js")
