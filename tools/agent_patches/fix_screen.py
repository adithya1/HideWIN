import re

path = r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\utils\window.js'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

if "const { screen, BrowserWindow } = require('electron');" not in content:
    content = content.replace("    const windows = BrowserWindow.getAllWindows();", "    const { screen, BrowserWindow } = require('electron');\n    const windows = BrowserWindow.getAllWindows();")
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Re-injected screen and BrowserWindow into startStealthMode!")
else:
    print("Already there.")
