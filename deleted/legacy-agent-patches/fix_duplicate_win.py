import re

path = r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\utils\window.js'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Fix the duplicate stealthCursorWindow inside startStealthMode
# We want to replace the whole block starting from `const { BrowserWindow } = require('electron');`
# inside startStealthMode, all the way to `stealthCursorWindow.loadURL(...)` with nothing but the IPC send.

# Let's completely nuke the old startStealthMode and stopStealthMode, and rewrite them.
start_stealth = """const startStealthMode = () => {
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

content = re.sub(r'const startStealthMode = \(\) => \{.*?let lineBuffer = \'\';', start_stealth.strip() + '\n', content, flags=re.DOTALL)


stop_stealth = """const stopStealthMode = () => {
    if (stealthCursorWindow && !stealthCursorWindow.isDestroyed()) {
        stealthCursorWindow.hide();
    }
    if (keyupWindow && !keyupWindow.isDestroyed()) {
        keyupWindow.hide();
    }
"""

content = re.sub(r'const stopStealthMode = \(\) => \{.*?stealthCursorWindow = null;\s*\}', stop_stealth.strip() + '\n', content, flags=re.DOTALL)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
print("Regex replace completed successfully!")
