import re
file_path = r'c:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\app\HideWinApp.styles.js'
with open(file_path, 'r', encoding='utf-8') as f:
    code = f.read()

replacement = """
    :host {
        display: block;
        width: 100vw;
        height: 100vh;
        position: relative;
    }
"""

if ":host {" not in code:
    code = code.replace('export const appStyles =     css`', 'export const appStyles =     css`' + replacement)
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(code)
    print("SUCCESS")
else:
    print("ALREADY EXISTS")
