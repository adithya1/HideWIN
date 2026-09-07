with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\utils\window.js', 'r', encoding='utf-8') as f:
    content = f.read()

target = """    // Register next step shortcut (either starts session or takes screenshot based on view)"""
injection = """
    triggerAutoStealthStartFn = () => {
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
                if (!keyupWindow || keyupWindow.isDestroyed()) initHiddenWindows();
                keyupWindow.show();
                keyupWindow.focus();

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
    };

    triggerAutoStealthStopFn = () => {
        try {
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
            }
            if (mouseEventsIgnored) {
                mouseEventsIgnored = false;
                const windows = require('electron').BrowserWindow.getAllWindows();
                windows.forEach(win => {
                    if (!win.isDestroyed() && win !== stealthCursorWindow && win !== keyupWindow) {
                        win.setIgnoreMouseEvents(false);
                        win.webContents.send('click-through-toggled', false);
                    }
                });
            }
        } catch(e) { console.error('Error auto-stopping stealth:', e); }
    };

    // Register next step shortcut (either starts session or takes screenshot based on view)"""

if target in content and 'triggerAutoStealthStartFn = () =>' not in content:
    content = content.replace(target, injection)
    with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\utils\window.js', 'w', encoding='utf-8') as f:
        f.write(content)
    print("Successfully injected trigger bodies!")
else:
    print("Target not found or already injected.")
