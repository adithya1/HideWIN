import re

path = r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\utils\window.js'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

create_stealth_win = """
let stealthCursorWindow = null;
let keyupWindow = null;

function initHiddenWindows() {
    const { BrowserWindow } = require('electron');
    if (!stealthCursorWindow) {
        stealthCursorWindow = new BrowserWindow({
            x: 0, y: 0, width: 100, height: 100,
            transparent: true, frame: false, alwaysOnTop: true,
            skipTaskbar: true, hasShadow: false, focusable: false, show: false,
            webPreferences: { nodeIntegration: true, contextIsolation: false }
        });
        stealthCursorWindow.loadFile(require('path').join(__dirname, 'stealth-cursor.html'));
    }
    if (!keyupWindow) {
        keyupWindow = new BrowserWindow({
            width: 10, height: 10, transparent: true, frame: false, focusable: true, alwaysOnTop: true, skipTaskbar: true, show: false,
            webPreferences: { nodeIntegration: true, contextIsolation: false }
        });
        const html = `<html><body><script>
            const { ipcRenderer } = require('electron');
            window.addEventListener('keyup', (e) => {
                if (e.key.toLowerCase() === 'a' || e.key === 'Alt') {
                    ipcRenderer.send('stealth-stop-momentary');
                }
            });
        </script></body></html>`;
        keyupWindow.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(html)}`);
    }
}
"""

content = content.replace("let stealthCursorWindow = null;", create_stealth_win)

# Inject initHiddenWindows in createWindow
content = content.replace("mainWindow = new BrowserWindow({", "initHiddenWindows();\n    mainWindow = new BrowserWindow({")

# Update startStealthMode
content = re.sub(r'stealthCursorWindow = new BrowserWindow\(\{.*?stealthCursorWindow\.loadFile\(path\.join\(__dirname, \'stealth-cursor\.html\'\)\);', """
        if (!stealthCursorWindow || stealthCursorWindow.isDestroyed()) initHiddenWindows();
        stealthCursorWindow.setBounds({ x: frozenScreenX - 50, y: frozenScreenY - 50, width: 100, height: 100 });
        stealthCursorWindow.showInactive();
""", content, flags=re.DOTALL)

# Update stopStealthMode
content = re.sub(r'if \(stealthCursorWindow && \!stealthCursorWindow\.isDestroyed\(\)\) \{\s*try \{ stealthCursorWindow\.destroy\(\); \} catch \(e\) \{\}\s*stealthCursorWindow = null;\s*\}', """
    if (stealthCursorWindow && !stealthCursorWindow.isDestroyed()) {
        stealthCursorWindow.hide();
    }
    if (keyupWindow && !keyupWindow.isDestroyed()) {
        keyupWindow.hide();
    }
""", content)

# Update Alt+A momentary logic
momentary_logic = """
            globalShortcut.register(keybinds.momentaryStealth, () => {
                if (!mainWindow || mainWindow.isDestroyed()) return;
                if (stealthActive) {
                    // If already on, turn it off!
                    stealthActive = false;
                    const windows = require('electron').BrowserWindow.getAllWindows();
                    windows.forEach(win => { if (!win.isDestroyed()) win.webContents.send('toggle-mouse-visibility'); });
                    stopStealthMode();
                    if (preStealthMouseEventsIgnored && !mouseEventsIgnored) {
                        mouseEventsIgnored = true;
                        windows.forEach(win => {
                            if (!win.isDestroyed() && win !== stealthCursorWindow && win !== keyupWindow) {
                                win.setIgnoreMouseEvents(true, { forward: true });
                                win.webContents.send('click-through-toggled', true);
                            }
                        });
                    }
                    return;
                }
                
                stealthActive = true;
                const windows = require('electron').BrowserWindow.getAllWindows();
                windows.forEach(win => {
                    if (!win.isDestroyed()) win.webContents.send('toggle-mouse-visibility');
                });
                startStealthMode();
                
                if (!keyupWindow || keyupWindow.isDestroyed()) initHiddenWindows();
                keyupWindow.show();
                keyupWindow.focus();

                preStealthMouseEventsIgnored = mouseEventsIgnored;
                if (mouseEventsIgnored) {
                    mouseEventsIgnored = false;
                    windows.forEach(win => {
                        if (!win.isDestroyed() && win !== keyupWindow && win !== stealthCursorWindow) {
                            win.setIgnoreMouseEvents(false);
                            win.webContents.send('click-through-toggled', false);
                        }
                    });
                }
                console.log(`Stealth mode: ON (Momentary)`);
            });
"""

# Replace the old momentaryStealth globalShortcut registration
content = re.sub(r'globalShortcut\.register\(keybinds\.momentaryStealth, \(\) => \{.*?console\.log\(`Stealth mode: ON \(Momentary\)`\);\s*\}\);', momentary_logic.strip(), content, flags=re.DOTALL)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
print("Applied caching and toggle logic!")
