import re

p = r"c:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\app\HideWinApp.js"
with open(p, 'r', encoding='utf-8') as f:
    text = f.read()

if '<div class="fake-cursor"></div>' not in text:
    text = text.replace('<div class="app-shell">', '<div class="app-shell">\n                <div class="fake-cursor"></div>')
    print("Actually injected fake cursor div!")

with open(p, 'w', encoding='utf-8') as f:
    f.write(text)
