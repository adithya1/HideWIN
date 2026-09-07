import re

path = r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\CustomizeView.js'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

momentary_html = """{ label: 'Momentary Magic Cursor (Hold & Release)', keys: this.keybinds.momentaryStealth || (isMac ? 'Cmd+Alt+A' : 'Alt+A'), desc: 'Hold this key down to freeze your cursor and use the red arrow quickly. Release to snap your real cursor back immediately.' },
            { label: 'Stealth Red Arrow (Magic Cursor)',"""

if 'Momentary Magic Cursor' not in content:
    content = content.replace("{ label: 'Stealth Red Arrow (Magic Cursor)',", momentary_html)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Added Alt+A to CustomizeView UI!")
else:
    print("Already added.")
