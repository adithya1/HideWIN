with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\utils\window.js', 'r', encoding='utf-8') as f:
    content = f.read()

header = """let isWindowIpcRegistered = false;"""
if 'triggerAutoStealthStart' not in content:
    content = content.replace(header, "let triggerAutoStealthStartFn = null;\nlet triggerAutoStealthStopFn = null;\n\n" + header)

export_target = """module.exports = {
    createWindow,"""
if 'triggerAutoStealthStart' not in export_target:
    content = content.replace(export_target, """module.exports = {
    triggerAutoStealthStart: () => { if(triggerAutoStealthStartFn) triggerAutoStealthStartFn(); },
    triggerAutoStealthStop: () => { if(triggerAutoStealthStopFn) triggerAutoStealthStopFn(); },
    createWindow,""")

# Inject the logic at the end of updateGlobalShortcuts, right before `}`
end_of_updateGlobalShortcuts = """    // Register extend actions"""
injection = """
    triggerAutoStealthStartFn = () => {
        try {
            // 1. Ghost mode ON
            if (!mouseEventsIgnored) {
                mouseEventsIgnored = true;
                if(mainWindow && !mainWindow.isDestroyed()) {
                    mainWindow.setIgnoreMouseEvents(true, { forward: true });
                    mainWindow.webContents.send('click-through-toggled', true);
                }
            }
            
            // 2. Stealth Mode / Red Arrow ON
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
            // 1. Stealth Mode / Red Arrow OFF
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
            
            // 2. Ghost mode OFF
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

    // Register extend actions"""

if 'triggerAutoStealthStartFn = () =>' not in content:
    content = content.replace(end_of_updateGlobalShortcuts, injection)

with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\utils\window.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("Injected auto trigger fns")
