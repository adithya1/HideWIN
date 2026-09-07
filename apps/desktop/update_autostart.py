with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\utils\window.js', 'r', encoding='utf-8') as f:
    content = f.read()

target = """    triggerAutoStealthStartFn = () => {
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
    };"""

replacement = """    triggerAutoStealthStartFn = () => {
        try {
            // SWAPPED LOGIC: Only enable Ghost Mode, leave Real Cursor free.
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

if target in content:
    content = content.replace(target, replacement)
    with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\utils\window.js', 'w', encoding='utf-8') as f:
        f.write(content)
    print("Updated triggerAutoStealthStartFn")
else:
    print("Could not find triggerAutoStealthStartFn")
