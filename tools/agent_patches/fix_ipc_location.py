import re

path = r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\utils\window.js'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

ipc_handler = """
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
"""

# Remove the broken block before !blockerExePath
broken_block_regex = r'    const \{ ipcMain \} = require\(\'electron\'\);\s*ipcMain\.removeAllListeners\(\'stealth-stop-momentary\'\).*?if \(event && event\.sender\) \{.*?win\.destroy\(\);\s*\}\s*\}\);\s*if \(\!blockerExePath\) \{'
content = re.sub(broken_block_regex, '    if (!blockerExePath) {', content, flags=re.DOTALL)

# Insert it safely after the actual ipcMain declaration
content = content.replace("    ipcMain.removeAllListeners('update-stealth-cursor-style');", ipc_handler + "\n    ipcMain.removeAllListeners('update-stealth-cursor-style');")

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
print("Moved IPC handler to safe location!")
