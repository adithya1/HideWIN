file_path = r"c:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\app\HideWinApp.js"
with open(file_path, 'r', encoding='utf-8') as f:
    code = f.read()

target = '<div style="position: absolute; top: 0; left: 0; width: 100%; display: flex; justify-content: center; z-index: 99999;">'
replacement = '<div style="position: absolute; top: 0; left: 0; width: 100%; display: flex; justify-content: center; z-index: 99999; pointer-events: none;">\n                <div style="pointer-events: auto; display: flex;">'

code = code.replace(target, replacement)
code = code.replace("${this.renderLiveBar()}\n            </div>\n            <div class=\"app-shell\"", "${this.renderLiveBar()}\n                </div>\n            </div>\n            <div class=\"app-shell\"")

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(code)
print("SUCCESS")
