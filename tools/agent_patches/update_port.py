import os

p = r"C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\InviteView.js"
with open(p, "r", encoding="utf-8") as f:
    text = f.read()

# Change default ports from 8001 to 8000
text = text.replace("'8001'", "'8000'")

with open(p, "w", encoding="utf-8") as f:
    f.write(text)

print("Updated default port to 8000")
