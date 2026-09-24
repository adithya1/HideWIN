import os

path = r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\utils\window.js'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Add momentaryStealth shortcut
content = content.replace("toggleMouseVisibility: isMac ? 'Cmd+Alt+M' : 'Ctrl+Alt+M',", "toggleMouseVisibility: isMac ? 'Cmd+Alt+M' : 'Alt+M',\n        momentaryStealth: isMac ? 'Cmd+Alt+A' : 'Alt+A',")

# Inject our variables and initHiddenWindows BEFORE createWindow
init_vars = """
let stealthCursorWindow = null;
let keyupWindow = null;
let isMomentaryStealth = false;

function initHiddenWindows() {
    const { BrowserWindow, screen } = require('electron');
    if (!stealthCursorWindow || stealthCursorWindow.isDestroyed()) {
        const displays = screen.getAllDisplays();
        let minX = 0, minY = 0, maxX = 0, maxY = 0;
        displays.forEach(d => {
            if (d.bounds.x < minX) minX = d.bounds.x;
            if (d.bounds.y < minY) minY = d.bounds.y;
            if (d.bounds.x + d.bounds.width > maxX) maxX = d.bounds.x + d.bounds.width;
            if (d.bounds.y + d.bounds.height > maxY) maxY = d.bounds.y + d.bounds.height;
        });
        const fullWidth = maxX - minX;
        const fullHeight = maxY - minY;
        
        stealthCursorWindow = new BrowserWindow({
            x: minX, y: minY, width: fullWidth, height: fullHeight,
            transparent: true, frame: false, alwaysOnTop: true,
            skipTaskbar: true, hasShadow: false, focusable: false, show: false,
            webPreferences: { nodeIntegration: true, contextIsolation: false }
        });
        stealthCursorWindow.setIgnoreMouseEvents(true, { forward: true });
        stealthCursorWindow.setAlwaysOnTop(true, 'screen-saver', 99);
        stealthCursorWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });

        const stealthHtml = `
            <html><body style="margin:0;overflow:hidden;">
            <div id="cursor" style="position:absolute; width:16px; height:16px; background-image:url('data:image/svg+xml;utf8,<svg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'24\\' height=\\'24\\' viewBox=\\'0 0 24 24\\'><path fill=\\'red\\' stroke=\\'white\\' stroke-width=\\'1\\' d=\\'M5.5 3.21V20.8c0 .45.54.67.85.35l4.86-4.86a.5.5 0 0 1 .35-.15h6.87c.45 0 .67-.54.35-.85L6.35 2.86a.5.5 0 0 0-.85.35Z\\'/></svg>'); background-size:contain; background-repeat:no-repeat; pointer-events:none; z-index:999999; transform:translate(-100px,-100px);"></div>
            <script>
                const { ipcRenderer } = require('electron');
                const cursor = document.getElementById('cursor');
                ipcRenderer.on('move-stealth-cursor-global', (_, pos) => {
                    cursor.style.transform = \\`translate(\\${pos.x}px, \\${pos.y}px)\\`;
                });
                ipcRenderer.on('update-stealth-cursor-style-global', (_, type) => {
                    if (type === 'pointer') { cursor.style.cursor = 'pointer'; }
                    else if (type === 'text') { cursor.style.cursor = 'text'; }
                    else { cursor.style.cursor = 'default'; }
                });
            </script>
            </body></html>
        `;
        stealthCursorWindow.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(stealthHtml)}`);
    }
    
    if (!keyupWindow || keyupWindow.isDestroyed()) {
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
content = content.replace("let stealthCursorWindow = null;", init_vars)
content = content.replace("const mainWindow = new BrowserWindow({", "initHiddenWindows();\n    const mainWindow = new BrowserWindow({")

# Now inject the IPC listener for stealth-stop-momentary
ipc_listener = """
    ipcMain.removeAllListeners('stealth-stop-momentary');
    ipcMain.on('stealth-stop-momentary', () => {
        if (stealthActive) {
            stealthActive = false;
            stopStealthMode();
            const windows = require('electron').BrowserWindow.getAllWindows();
            windows.forEach(win => {
                if (!win.isDestroyed()) win.webContents.send('toggle-mouse-visibility');
            });
            if (preStealthMouseEventsIgnored && !mouseEventsIgnored) {
                mouseEventsIgnored = true;
                windows.forEach(win => {
                    if (!win.isDestroyed() && win !== stealthCursorWindow && win !== keyupWindow) {
                        win.setIgnoreMouseEvents(true, { forward: true });
                        win.webContents.send('click-through-toggled', true);
                    }
                });
            }
        }
    });
"""
content = content.replace("ipcMain.removeAllListeners('update-stealth-cursor-style');", ipc_listener + "\n    ipcMain.removeAllListeners('update-stealth-cursor-style');")

# Completely rewrite startStealthMode
start_stealth = """
const startStealthMode = () => {
    if (blockerProcess) return;

    const { BrowserWindow, screen } = require('electron');
    const windows = BrowserWindow.getAllWindows();
    windows.forEach(win => {
        if (win.webContents.id === sessionWindowId && !win.isDestroyed()) {
            if (win.isMinimized()) win.restore();
        }
    });

    const curPos = screen.getCursorScreenPoint();
    frozenScreenX = curPos.x;
    frozenScreenY = curPos.y;
    redDotDX = 0;
    redDotDY = 0;

    try {
        if (!stealthCursorWindow || stealthCursorWindow.isDestroyed()) initHiddenWindows();
        const displays = screen.getAllDisplays();
        let minX = 0, minY = 0;
        displays.forEach(d => {
            if (d.bounds.x < minX) minX = d.bounds.x;
            if (d.bounds.y < minY) minY = d.bounds.y;
        });
        stealthCursorWindow.webContents.send('move-stealth-cursor-global', {
            x: frozenScreenX - minX,
            y: frozenScreenY - minY
        });
        stealthCursorWindow.showInactive();

        const { spawn } = require('child_process');
        blockerProcess = spawn(blockerExePath, [String(frozenScreenX), String(frozenScreenY)], {
            stdio: ['pipe', 'pipe', 'pipe'],
            windowsHide: true,
        });

        let lineBuffer = '';
"""

import re
content = re.sub(r'const startStealthMode = \(\) => \{.*?let lineBuffer = \'\';', start_stealth.strip() + "\n", content, flags=re.DOTALL)

# Completely rewrite stopStealthMode
stop_stealth = """
const stopStealthMode = () => {
    if (stealthCursorWindow && !stealthCursorWindow.isDestroyed()) {
        stealthCursorWindow.hide();
    }
    if (keyupWindow && !keyupWindow.isDestroyed()) {
        keyupWindow.hide();
    }

    if (blockerProcess) {
        try {
            blockerProcess.stdin.write('EXIT\\n');
            blockerProcess.kill();
        } catch (e) {
            console.error('Error killing blocker process:', e);
        }
        blockerProcess = null;
    }
    stealthActive = false;
    isMomentaryStealth = false;
};
"""
content = re.sub(r'const stopStealthMode = \(\) => \{.*?\};', stop_stealth.strip(), content, flags=re.DOTALL)

# Rewrite the keybinds section for Alt+A and Alt+M
shortcuts = """
    if (keybinds.momentaryStealth) {
        try {
            globalShortcut.register(keybinds.momentaryStealth, () => {
                if (!mainWindow || mainWindow.isDestroyed()) return;
                if (stealthActive) {
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
            });
        } catch (e) {}
    }

    if (keybinds.toggleMouseVisibility) {
        try {
            globalShortcut.register(keybinds.toggleMouseVisibility, () => {
                if (!mainWindow || mainWindow.isDestroyed()) return;
                if (stealthActive) {
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
                } else {
                    stealthActive = true;
                    const windows = require('electron').BrowserWindow.getAllWindows();
                    windows.forEach(win => {
                        if (!win.isDestroyed()) win.webContents.send('toggle-mouse-visibility');
                    });
                    startStealthMode();

                    preStealthMouseEventsIgnored = mouseEventsIgnored;
                    if (mouseEventsIgnored) {
                        mouseEventsIgnored = false;
                        windows.forEach(win => {
                            if (!win.isDestroyed() && win !== stealthCursorWindow && win !== keyupWindow) {
                                win.setIgnoreMouseEvents(false);
                                win.webContents.send('click-through-toggled', false);
                            }
                        });
                    }
                }
            });
        } catch (e) {}
    }
"""
content = re.sub(r'if \(keybinds\.toggleMouseVisibility\) \{.*?catch \(error\) \{.*?\}.*?\}', shortcuts.strip(), content, flags=re.DOTALL)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
print("Applied clean unified patch!")
