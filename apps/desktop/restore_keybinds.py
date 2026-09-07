with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\utils\window.js', 'r', encoding='utf-8') as f:
    content = f.read()

missing_keybinds = """
    if (keybinds.momentaryStealth) {
        try {
            globalShortcut.register(keybinds.momentaryStealth, () => {
                if (!mainWindow || mainWindow.isDestroyed()) return;
                
                // --- ROBUST BINARY TOGGLE LOGIC (0 or 1) ---
                if (!stealthActive) {
                    // STATE 1: Turn ON Red Arrow, Freeze Real Cursor
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
                    console.log("Alt+A: STATE 1 (Red Arrow ON, Real Mouse FROZEN)");
                } else {
                    // STATE 0: Turn OFF Red Arrow, Unfreeze Real Cursor
                    stealthActive = false;
                    
                    const windows = require('electron').BrowserWindow.getAllWindows();
                    windows.forEach(win => {
                        if (!win.isDestroyed()) win.webContents.send('toggle-mouse-visibility');
                    });
                    
                    stopStealthMode();
                    
                    if (!mouseEventsIgnored) {
                        mouseEventsIgnored = true;
                        windows.forEach(win => {
                            if (!win.isDestroyed() && win !== stealthCursorWindow && win !== keyupWindow) {
                                win.setIgnoreMouseEvents(true, { forward: true });
                                win.webContents.send('click-through-toggled', true);
                            }
                        });
                    }
                    console.log("Alt+A: STATE 0 (Red Arrow OFF, Real Mouse FREE)");
                }
            });
            console.log(`Registered momentaryStealth (Toggle): ${keybinds.momentaryStealth}`);
        } catch (e) {
            console.error(`Failed to register momentaryStealth:`, e);
        }
    }

    if (keybinds.toggleMouseVisibility) {
        try {
            globalShortcut.register(keybinds.toggleMouseVisibility, () => {
                if (!mainWindow || mainWindow.isDestroyed()) return;
                if (stealthActive) {
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
            console.log(`Registered toggleMouseVisibility: ${keybinds.toggleMouseVisibility}`);
        } catch (e) {
            console.error(`Failed to register toggleMouseVisibility:`, e);
        }
    }
"""

target = "    triggerAutoStealthStartFn = () => {"
content = content.replace(target, missing_keybinds + "\n" + target)

with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\utils\window.js', 'w', encoding='utf-8') as f:
    f.write(content)
print("Restored missing keybinds")
