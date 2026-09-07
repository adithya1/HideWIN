with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\utils\window.js', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update the KeyDown logic
keydown_target = """            globalShortcut.register(keybinds.momentaryStealth, () => {
                if (!mainWindow || mainWindow.isDestroyed()) return;
                if (stealthActive) return; // IGNORE KEY REPEAT!
                
                
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
            });"""

keydown_new = """            globalShortcut.register(keybinds.momentaryStealth, () => {
                if (!mainWindow || mainWindow.isDestroyed()) return;
                if (!stealthActive) return; // INVERTED: Ignore if already off!
                
                stealthActive = false; // Turn off temporarily
                
                const windows = require('electron').BrowserWindow.getAllWindows();
                windows.forEach(win => {
                    if (!win.isDestroyed()) win.webContents.send('toggle-mouse-visibility');
                });
                stopStealthMode();
                
                if (!keyupWindow || keyupWindow.isDestroyed()) initHiddenWindows();
                keyupWindow.show();
                keyupWindow.focus();

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

if keydown_target in content:
    content = content.replace(keydown_target, keydown_new)
else:
    print("Could not find keydown_target")

# 2. Update the KeyUp logic
keyup_target = """    ipcMain.on('stealth-stop-momentary', () => {
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

keyup_new = """    ipcMain.on('stealth-stop-momentary', () => {
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

if keyup_target in content:
    content = content.replace(keyup_target, keyup_new)
else:
    print("Could not find keyup_target")

with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\utils\window.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("Replaced logic!")
