import re

path = r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\utils\window.js'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

replacement = """
    try {
        ipcMain.removeAllListeners('stealth-stop-momentary');
        ipcMain.on('stealth-stop-momentary', (event) => {
            if (stealthActive) {
                stealthActive = false;
                const windows = require('electron').BrowserWindow.getAllWindows();
                windows.forEach(win => {
                    if (!win.isDestroyed()) win.webContents.send('toggle-mouse-visibility');
                });
                stopStealthMode();
                
                if (preStealthMouseEventsIgnored && !mouseEventsIgnored) {
                    mouseEventsIgnored = true;
                    windows.forEach(win => {
                        if (!win.isDestroyed() && win !== stealthCursorWindow) {
                            win.setIgnoreMouseEvents(true, { forward: true });
                            win.webContents.send('click-through-toggled', true);
                        }
                    });
                }
                console.log(`Stealth mode: OFF (Momentary Release)`);
            }
            if (event && event.sender) {
                const win = require('electron').BrowserWindow.fromWebContents(event.sender);
                if (win && !win.isDestroyed()) win.destroy();
            }
        });
    } catch(e) { console.error("CRASH AT IPCMAIN:", e); }
"""

content = re.sub(r'\s*ipcMain\.removeAllListeners\(\'stealth-stop-momentary\'\).*?win\.destroy\(\);\s*\}\s*\}\);', replacement, content, flags=re.DOTALL)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
