with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\utils\window.js', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. triggerAutoStealthStartFn
target1 = """    triggerAutoStealthStartFn = () => {
        try {
            if (!mouseEventsIgnored) {
                mouseEventsIgnored = true;
                if(mainWindow && !mainWindow.isDestroyed()) {
                    mainWindow.setIgnoreMouseEvents(true, { forward: true });
                    mainWindow.webContents.send('click-through-toggled', true);
                }
            }
            if (!stealthActive) {
                stealthActive = true;
                const windows = require('electron').BrowserWindow.getAllWindows();
                windows.forEach(win => {
                    if (!win.isDestroyed()) win.webContents.send('toggle-mouse-visibility');
                });
                startStealthMode();
                // Use robust global PowerShell poller instead of focus-dependent keyupWindow
                const { spawn } = require('child_process');
                const path = require('path');
                const pollerPath = path.join(__dirname, 'poll_key.ps1');
                const poller = spawn('powershell.exe', ['-ExecutionPolicy', 'Bypass', '-File', pollerPath], { windowsHide: true });
                poller.on('exit', () => {
                    const { ipcMain } = require('electron');
                    // Emit the release event internally
                    ipcMain.emit('stealth-stop-momentary');
                });

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
        } catch(e) { console.error('Error auto-starting stealth:', e); }
    };"""

rep1 = """    triggerAutoStealthStartFn = () => {
        try {
            // SWAP LOGIC: Only enable Ghost Mode (Real Mouse is free)
            if (!mouseEventsIgnored) {
                mouseEventsIgnored = true;
                if(mainWindow && !mainWindow.isDestroyed()) {
                    mainWindow.setIgnoreMouseEvents(true, { forward: true });
                    mainWindow.webContents.send('click-through-toggled', true);
                }
                const windows = require('electron').BrowserWindow.getAllWindows();
                windows.forEach(win => {
                    if (!win.isDestroyed() && win !== stealthCursorWindow && win !== keyupWindow) {
                        win.setIgnoreMouseEvents(true, { forward: true });
                        win.webContents.send('click-through-toggled', true);
                    }
                });
            }
        } catch(e) { console.error('Error auto-starting stealth:', e); }
    };"""
content = content.replace(target1, rep1)

# 2. Keydown Alt+A (momentaryStealth)
target2 = """            globalShortcut.register(keybinds.momentaryStealth, () => {
                if (!mainWindow || mainWindow.isDestroyed()) return;
                if (!stealthActive) return; // INVERTED: Ignore if already off!
                
                stealthActive = false; // Turn off temporarily
                
                const windows = require('electron').BrowserWindow.getAllWindows();
                windows.forEach(win => {
                    if (!win.isDestroyed()) win.webContents.send('toggle-mouse-visibility');
                });
                stopStealthMode();
                
                // Use robust global PowerShell poller instead of focus-dependent keyupWindow
                const { spawn } = require('child_process');
                const path = require('path');
                const pollerPath = path.join(__dirname, 'poll_key.ps1');
                const poller = spawn('powershell.exe', ['-ExecutionPolicy', 'Bypass', '-File', pollerPath], { windowsHide: true });
                poller.on('exit', () => {
                    const { ipcMain } = require('electron');
                    // Emit the release event internally
                    ipcMain.emit('stealth-stop-momentary');
                });

                preStealthMouseEventsIgnored = mouseEventsIgnored; // remember state
                if (!mouseEventsIgnored) {
                    mouseEventsIgnored = true;
                    windows.forEach(win => {
                        if (!win.isDestroyed() && win !== keyupWindow && win !== stealthCursorWindow) {
                            win.setIgnoreMouseEvents(true, { forward: true });
                            win.webContents.send('click-through-toggled', true);
                        }
                    });
                }
            });"""

rep2 = """            globalShortcut.register(keybinds.momentaryStealth, () => {
                if (!mainWindow || mainWindow.isDestroyed()) return;
                if (stealthActive) return; // SWAPPED LOGIC: Ignore if already ON (holding)
                
                stealthActive = true; // Turn ON
                
                const windows = require('electron').BrowserWindow.getAllWindows();
                windows.forEach(win => {
                    if (!win.isDestroyed()) win.webContents.send('toggle-mouse-visibility');
                });
                startStealthMode();
                
                const { spawn } = require('child_process');
                const path = require('path');
                const pollerPath = path.join(__dirname, 'poll_key.ps1');
                const poller = spawn('powershell.exe', ['-ExecutionPolicy', 'Bypass', '-File', pollerPath], { windowsHide: true });
                poller.on('exit', () => {
                    const { ipcMain } = require('electron');
                    ipcMain.emit('stealth-stop-momentary');
                });

                preStealthMouseEventsIgnored = mouseEventsIgnored; 
                if (mouseEventsIgnored) {
                    mouseEventsIgnored = false; // Disable ghost mode so we can click with red arrow
                    windows.forEach(win => {
                        if (!win.isDestroyed() && win !== keyupWindow && win !== stealthCursorWindow) {
                            win.setIgnoreMouseEvents(false);
                            win.webContents.send('click-through-toggled', false);
                        }
                    });
                }
            });"""
content = content.replace(target2, rep2)

# 3. Keyup Alt+A (stealth-stop-momentary)
target3 = """    ipcMain.on('stealth-stop-momentary', () => {
        if (!stealthActive) {
            stealthActive = true;
            const windows = require('electron').BrowserWindow.getAllWindows();
            windows.forEach(win => {
                if (!win.isDestroyed()) win.webContents.send('toggle-mouse-visibility');
            });
            startStealthMode();
            
            if (mouseEventsIgnored) {
                mouseEventsIgnored = false;
                windows.forEach(win => {
                    if (!win.isDestroyed() && win !== stealthCursorWindow && win !== keyupWindow) {
                        win.setIgnoreMouseEvents(false);
                        win.webContents.send('click-through-toggled', false);
                    }
                });
            }
            
            // Hide the keyupWindow so it doesn't stay focused and block other inputs
            if (keyupWindow && !keyupWindow.isDestroyed()) {
                keyupWindow.hide();
            }
        }
    });"""

rep3 = """    ipcMain.on('stealth-stop-momentary', () => {
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
    });"""
content = content.replace(target3, rep3)

with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\utils\window.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated window.js completely")
