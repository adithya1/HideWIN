import os

p = r"c:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\app\HideWinApp.js"
with open(p, "r", encoding="utf-8") as f:
    text = f.read()

if "InviteView.js" not in text:
    text = text.replace("import { AuthView } from '../views/AuthView.js';", "import { AuthView } from '../views/AuthView.js';\nimport '../views/InviteView.js';")
    with open(p, "w", encoding="utf-8") as f:
        f.write(text)
    print("Fixed import!")
else:
    print("Already exists!")
