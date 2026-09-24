import re

path = r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\utils\window.js'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

if "stealthCursorWindow.focus();" not in content:
    content = content.replace("    stealthCursorWindow.setAlwaysOnTop(true, 'screen-saver', 99);", "    stealthCursorWindow.show();\n    stealthCursorWindow.focus();\n    stealthCursorWindow.setAlwaysOnTop(true, 'screen-saver', 99);")
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Added stealthCursorWindow.focus()!")
else:
    print("Already there.")
