const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'Hide-Win-Master', 'src', 'utils', 'window.js');
let content = fs.readFileSync(filePath, 'utf8');

const startIndex = content.indexOf('    if (keybinds.toggleMouseVisibility) {');
const endIndex = content.indexOf('    // Register next step shortcut');

if (startIndex === -1 || endIndex === -1) {
    console.error("COULD NOT FIND INDICES");
    process.exit(1);
}

const newAltMAndA = `    if (keybinds.momentaryStealth) {
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
            console.log(\`Registered momentaryStealth: \${keybinds.momentaryStealth}\`);
        } catch (e) {
            console.error(\`Failed to register momentaryStealth:\`, e);
        }
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
            console.log(\`Registered toggleMouseVisibility: \${keybinds.toggleMouseVisibility}\`);
        } catch (e) {
            console.error(\`Failed to register toggleMouseVisibility:\`, e);
        }
    }

`;

content = content.slice(0, startIndex) + newAltMAndA + content.slice(endIndex);

fs.writeFileSync(filePath, content, 'utf8');
console.log("Patched shortcut block successfully!");
