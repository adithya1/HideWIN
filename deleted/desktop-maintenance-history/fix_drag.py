file_path = r"c:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\app\HideWinApp.js"
with open(file_path, 'r', encoding='utf-8') as f:
    code = f.read()

target = '<div style="pointer-events: auto; display: flex;">'
replacement = '<div style="pointer-events: auto; display: flex; -webkit-app-region: drag;">'
code = code.replace(target, replacement)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(code)

print("SUCCESS")
