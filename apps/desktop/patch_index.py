import sys
file = r'c:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\index.js'
content = open(file, 'r', encoding='utf-8').read()
prefix = "require('electron').app.commandLine.appendSwitch('enable-features', 'SharedArrayBuffer');\n"
if prefix not in content:
    content = prefix + content
    open(file, 'w', encoding='utf-8').write(content)
    print("Patched index.js")
else:
    print("Already patched")
