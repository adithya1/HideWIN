import re

p = r"c:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\app\HideWinApp.js"
with open(p, "r", encoding="utf-8") as f:
    text = f.read()

idx = text.find("renderTopToolbar()")
print(text[idx:idx+3000])
