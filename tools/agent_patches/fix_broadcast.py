import re

path = r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\utils\window.js'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace broadcastStealthState with the correct logic
correct_broadcast = """
                    const windows = require('electron').BrowserWindow.getAllWindows();
                    windows.forEach(win => {
                        if (!win.isDestroyed()) win.webContents.send('toggle-mouse-visibility');
                    });
"""

content = content.replace("broadcastStealthState(true);", correct_broadcast)
content = content.replace("broadcastStealthState(false);", correct_broadcast)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
print("Fixed broadcastStealthState ReferenceError!")
