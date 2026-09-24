file_path = r"c:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\app\HideWinApp.js"
with open(file_path, 'r', encoding='utf-8') as f:
    code = f.read()

target = '<div class="app-shell" style="${this.isSessionHidden ? \'display: none;\' : \'margin-top: 48px; height: calc(100vh - 48px);\'}">'
replacement = '<div class="app-shell" style="${this.isSessionHidden ? \'display: none;\' : \'position: absolute; top: 48px; left: 0; width: 100%; height: calc(100vh - 48px);\'}">'
code = code.replace(target, replacement)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(code)

print("SUCCESS")
