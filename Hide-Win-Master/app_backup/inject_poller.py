with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\utils\window.js', 'r', encoding='utf-8') as f:
    content = f.read()

target = """                if (!keyupWindow || keyupWindow.isDestroyed()) initHiddenWindows();
                keyupWindow.show();
                keyupWindow.focus();"""

replacement = """                // Use robust global PowerShell poller instead of focus-dependent keyupWindow
                const { spawn } = require('child_process');
                const path = require('path');
                const pollerPath = path.join(__dirname, 'poll_key.ps1');
                const poller = spawn('powershell.exe', ['-ExecutionPolicy', 'Bypass', '-File', pollerPath], { windowsHide: true });
                poller.on('exit', () => {
                    const { ipcMain } = require('electron');
                    // Emit the release event internally
                    ipcMain.emit('stealth-stop-momentary');
                });"""

if target in content:
    content = content.replace(target, replacement)
    with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\utils\window.js', 'w', encoding='utf-8') as f:
        f.write(content)
    print("Injected global key poller")
else:
    print("Target not found")
