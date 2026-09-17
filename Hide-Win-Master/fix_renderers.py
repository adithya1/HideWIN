import re

file_path = r"c:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\app\HideWinAppRenderers.js"
with open(file_path, 'r', encoding='utf-8') as f:
    code = f.read()

code = code.replace("if (!this._isLiveMode()) return '';", "")

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(code)
print("SUCCESS")
