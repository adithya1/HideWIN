import re

p = r"c:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\utils\window.js"
with open(p, 'r', encoding='utf-8') as f:
    text = f.read()

text = text.replace("mainWindow.webContents.send('toggle-mouse-visibility');", "mainWindow.webContents.send('set-stealth-state', stealthActive);")

with open(p, 'w', encoding='utf-8') as f:
    f.write(text)

p2 = r"c:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\app\HideWinApp.js"
with open(p2, 'r', encoding='utf-8') as f:
    text2 = f.read()

# Make sure _boundStealthMove sets cursor style correctly to visible
text2 = text2.replace("cursor.style.display = 'none';", "")
text2 = text2.replace("cursor.style.display = '';", "")
text2 = text2.replace("if (fakeCursor) fakeCursor.style.display = isActive ? 'block' : 'none';", "if (fakeCursor) fakeCursor.style.display = 'block';")

with open(p2, 'w', encoding='utf-8') as f:
    f.write(text2)

print("Fixed state toggle!")
