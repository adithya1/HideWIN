import re, os

path = r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\utils\window.js'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Remove variables blockerProcess, redDotDX, etc.
content = re.sub(r'let blockerProcess = null;\s*let frozenScreenX = 0;\s*let frozenScreenY = 0;\s*let redDotDX = 0;\s*let redDotDY = 0;\s*let blockerExePath = null;', 'let frozenScreenX = 0;\nlet frozenScreenY = 0;\nlet isMomentaryStealth = false;', content)

# 2. Replace startStealthMode
start_stealth = """const startStealthMode = (momentary = false) => {
    isMomentaryStealth = momentary;
    if (stealthCursorWindow && !stealthCursorWindow.isDestroyed()) {
        stealthCursorWindow.webContents.send('set-momentary', isMomentaryStealth);
        return;
    }

    const { screen, BrowserWindow, ipcMain } = require('electron');
    const windows = BrowserWindow.getAllWindows();
    windows.forEach(win => {
        if (win.webContents.id === sessionWindowId && !win.isDestroyed()) {
            if (win.isMinimized()) win.restore();
        }
    });

    // Capture frozen position
    const curPos = screen.getCursorScreenPoint();
    frozenScreenX = curPos.x;
    frozenScreenY = curPos.y;

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
        skipTaskbar: true, hasShadow: false, focusable: true,
        webPreferences: { nodeIntegration: true, contextIsolation: false }
    });
    stealthCursorWindow.setAlwaysOnTop(true, 'screen-saver', 99);
    stealthCursorWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });

    const stealthHtml = `
        <html><body style="margin:0;overflow:hidden;width:100vw;height:100vh;">
        <div id="cursor" style="position:absolute; width:16px; height:16px; background-image:url('data:image/svg+xml;utf8,<svg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'24\\' height=\\'24\\' viewBox=\\'0 0 24 24\\'><path fill=\\'red\\' stroke=\\'white\\' stroke-width=\\'1\\' d=\\'M5.5 3.21V20.8c0 .45.54.67.85.35l4.86-4.86a.5.5 0 0 1 .35-.15h6.87c.45 0 .67-.54.35-.85L6.35 2.86a.5.5 0 0 0-.85.35Z\\'/></svg>'); background-size:contain; background-repeat:no-repeat; pointer-events:none; z-index:999999; transform:translate(${frozenScreenX - minX}px,${frozenScreenY - minY}px);"></div>
        <script>
            const { ipcRenderer } = require('electron');
            const cursor = document.getElementById('cursor');
            let posX = ${frozenScreenX - minX};
            let posY = ${frozenScreenY - minY};
            let isMomentary = ${isMomentaryStealth};
            
            ipcRenderer.on('set-momentary', (_, val) => { isMomentary = val; });

            document.body.requestPointerLock = document.body.requestPointerLock || document.body.webkitRequestPointerLock;
            
            // Try locking repeatedly until success (sometimes requires small delay)
            const tryLock = () => {
                if (!document.pointerLockElement) {
                    document.body.requestPointerLock();
                    setTimeout(tryLock, 200);
                }
            };
            tryLock();

            document.addEventListener('mousemove', (e) => {
                if (document.pointerLockElement) {
                    posX += e.movementX;
                    posY += e.movementY;
                    cursor.style.transform = \\`translate(\\${posX}px, \\${posY}px)\\`;
                }
            });

            const sendMouseEvent = (type, button) => {
                const globalX = posX + ${minX};
                const globalY = posY + ${minY};
                ipcRenderer.send('stealth-mouse-event', { type, button, globalX, globalY });
            };

            document.addEventListener('mousedown', (e) => sendMouseEvent('mouseDown', e.button));
            document.addEventListener('mouseup', (e) => sendMouseEvent('mouseUp', e.button));
            
            window.addEventListener('keyup', (e) => {
                if (isMomentary && (e.key.toLowerCase() === 'a' || e.key === 'Alt')) {
                    document.exitPointerLock();
                    ipcRenderer.send('stealth-stop-momentary');
                }
            });
        </script>
        </body></html>
    `;
    stealthCursorWindow.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(stealthHtml)}`);
    console.log('Stealth ON (Pointer Lock) - frozen at', frozenScreenX, frozenScreenY);
};"""

content = re.sub(r'const startStealthMode = \(\) => \{.*?(?=const stopStealthMode = \(\) => \{)', start_stealth + '\n', content, flags=re.DOTALL)

# 3. Replace stopStealthMode
stop_stealth = """const stopStealthMode = () => {
    if (stealthCursorWindow && !stealthCursorWindow.isDestroyed()) {
        try { stealthCursorWindow.destroy(); } catch (e) {}
        stealthCursorWindow = null;
    }
    stealthActive = false;
    isMomentaryStealth = false;
    console.log('Stealth OFF - cursor released');
};"""

content = re.sub(r'const stopStealthMode = \(\) => \{.*?\};', stop_stealth, content, flags=re.DOTALL)

# 4. Inject IPC listeners for mouse events right before stopStealthMode
ipc_listeners = """
    const { ipcMain } = require('electron');
    ipcMain.removeAllListeners('stealth-mouse-event');
    ipcMain.on('stealth-mouse-event', (_, data) => {
        if (!stealthActive) return;
        const { type, button, globalX, globalY } = data;
        let targetWin = null;
        
        const windows = require('electron').BrowserWindow.getAllWindows();
        let sessionWin = null;
        let mainWin = null;
        windows.forEach(win => {
            if (!win.isDestroyed() && win.isVisible()) {
                if (win.webContents.id === sessionWindowId) sessionWin = win;
                if (win.webContents.id === mainWindowId) mainWin = win;
            }
        });

        if (sessionWin) {
            const b = sessionWin.getContentBounds();
            if (globalX >= b.x && globalX <= b.x + b.width && globalY >= b.y && globalY <= b.y + b.height) targetWin = sessionWin;
        }
        if (!targetWin && mainWin) {
            const b = mainWin.getContentBounds();
            if (globalX >= b.x && globalX <= b.x + b.width && globalY >= b.y && globalY <= b.y + b.height) targetWin = mainWin;
        }

        if (targetWin) {
            let btnStr = 'left';
            if (button === 1) btnStr = 'middle';
            else if (button === 2) btnStr = 'right';
            const initX = globalX - targetWin.getContentBounds().x;
            const initY = globalY - targetWin.getContentBounds().y;
            targetWin.webContents.sendInputEvent({ type: type, button: btnStr, x: initX, y: initY, clickCount: 1 });
        }
    });

    ipcMain.removeAllListeners('stealth-stop-momentary');
    ipcMain.on('stealth-stop-momentary', () => {
        stopStealthMode();
        broadcastStealthState(false);
    });
"""

content = content.replace("const stopStealthMode = () => {", ipc_listeners + "\nconst stopStealthMode = () => {")

# 5. Add Alt+A to keybinds handling
# In updateGlobalShortcuts
content = content.replace("if (keybinds.toggleMouseVisibility) {", """
    if (keybinds.momentaryStealth) {
        try {
            globalShortcut.register(keybinds.momentaryStealth, () => {
                if (!mainWindow || mainWindow.isDestroyed()) return;
                if (!stealthActive) {
                    stealthActive = true;
                    broadcastStealthState(true);
                    startStealthMode(true);
                }
            });
            console.log(`Registered momentaryStealth: ${keybinds.momentaryStealth}`);
        } catch (error) {
            console.error(`Failed to register momentaryStealth:`, error);
        }
    }

    if (keybinds.toggleMouseVisibility) {""")

# Add it to getDefaultKeybinds
content = content.replace("toggleMouseVisibility: isMac ? 'Cmd+Alt+M' : 'Alt+M',", "toggleMouseVisibility: isMac ? 'Cmd+Alt+M' : 'Alt+M',\n        momentaryStealth: isMac ? 'Cmd+Alt+A' : 'Alt+A',")

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated window.js for Pointer Lock!")
