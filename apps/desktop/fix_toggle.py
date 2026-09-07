with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\utils\window.js', 'r', encoding='utf-8') as f:
    content = f.read()

import re
target = re.search(r'globalShortcut\.register\(keybinds\.toggleMouseVisibility, \(\) => \{.*?(?=console\.log\(`Registered toggleMouseVisibility)', content, re.DOTALL)
if target:
    new_toggle = """globalShortcut.register(keybinds.toggleMouseVisibility, () => {
                if (!mainWindow || mainWindow.isDestroyed()) return;
                if (stealthActive) {
                    const windows = require('electron').BrowserWindow.getAllWindows();
                    windows.forEach(win => { if (!win.isDestroyed()) win.webContents.send('toggle-mouse-visibility'); });
                    stopStealthMode();
                } else {
                    stealthActive = true;
                    const windows = require('electron').BrowserWindow.getAllWindows();
                    windows.forEach(win => {
                        if (!win.isDestroyed()) win.webContents.send('toggle-mouse-visibility');
                    });
                    startStealthMode();
                }
            });
            """
    content = content.replace(target.group(0), new_toggle)
    with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\utils\window.js', 'w', encoding='utf-8') as f:
        f.write(content)
    print("Fixed toggleMouseVisibility")
