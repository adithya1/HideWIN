import re

path = r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\utils\window.js'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Add momentaryStealth to keybinds default
content = content.replace("toggleMouseVisibility: isMac ? 'Cmd+Alt+M' : 'Ctrl+Alt+M',", "toggleMouseVisibility: isMac ? 'Cmd+Alt+M' : 'Alt+M',\n        momentaryStealth: isMac ? 'Cmd+Alt+A' : 'Alt+A',")

# Inject stealth-stop-momentary IPC handler
ipc_handler = """
    const { ipcMain } = require('electron');
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
content = content.replace("    if (!blockerExePath) {", ipc_handler + "\n    if (!blockerExePath) {")

# Inject the Alt+A global shortcut block
momentary_block = """
    if (keybinds.momentaryStealth) {
        try {
            globalShortcut.register(keybinds.momentaryStealth, () => {
                if (!mainWindow || mainWindow.isDestroyed()) return;
                if (!stealthActive) {
                    stealthActive = true;
                    const windows = require('electron').BrowserWindow.getAllWindows();
                    windows.forEach(win => {
                        if (!win.isDestroyed()) win.webContents.send('toggle-mouse-visibility');
                    });
                    startStealthMode();
                    
                    const { BrowserWindow } = require('electron');
                    const keyupWindow = new BrowserWindow({
                        width: 10, height: 10, transparent: true, frame: false, focusable: true, alwaysOnTop: true, skipTaskbar: true,
                        webPreferences: { nodeIntegration: true, contextIsolation: false }
                    });
                    keyupWindow.show();
                    keyupWindow.focus();
                    const html = `<html><body><script>
                        const { ipcRenderer } = require('electron');
                        window.addEventListener('keyup', (e) => {
                            if (e.key.toLowerCase() === 'a' || e.key === 'Alt') {
                                ipcRenderer.send('stealth-stop-momentary');
                            }
                        });
                    </script></body></html>`;
                    keyupWindow.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(html)}`);

                    preStealthMouseEventsIgnored = mouseEventsIgnored;
                    if (mouseEventsIgnored) {
                        mouseEventsIgnored = false;
                        windows.forEach(win => {
                            if (!win.isDestroyed() && win !== keyupWindow) {
                                win.setIgnoreMouseEvents(false);
                                win.webContents.send('click-through-toggled', false);
                            }
                        });
                    }
                    console.log(`Stealth mode: ON (Momentary)`);
                }
            });
            console.log(`Registered momentaryStealth: ${keybinds.momentaryStealth}`);
        } catch (error) {
            console.error(`Failed to register momentaryStealth:`, error);
        }
    }

    if (keybinds.toggleMouseVisibility) {"""

content = content.replace("    if (keybinds.toggleMouseVisibility) {", momentary_block)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
print("Applied Hybrid C++ & Keyup Window patch!")
