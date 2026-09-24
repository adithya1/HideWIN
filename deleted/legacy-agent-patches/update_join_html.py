import os
import re

p = r"C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\InviteView.js"
with open(p, "r", encoding="utf-8") as f:
    text = f.read()

text = text.replace("/invite/index.html", "/invite/join.html")

with open(p, "w", encoding="utf-8") as f:
    f.write(text)
print("Updated InviteView to use join.html!")
