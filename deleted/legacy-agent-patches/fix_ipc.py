import os

p = r"C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\InviteView.js"
with open(p, "r", encoding="utf-8") as f:
    text = f.read()

# Fix the IPC channel call
if "'get-preferences'" in text:
    text = text.replace("'get-preferences'", "'storage:get-preferences'")
    with open(p, "w", encoding="utf-8") as f:
        f.write(text)
    print("Fixed IPC channel call in InviteView.js!")
else:
    print("Already fixed or not found")
