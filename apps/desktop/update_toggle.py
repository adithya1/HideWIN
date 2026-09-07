import re

with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\utils\window.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Use regex to find the entire block of globalShortcut.register(keybinds.momentaryStealth, ...) 
# until the next keybind registration.
pattern = r'(globalShortcut\.register\(keybinds\.momentaryStealth.*?)(?=\s*if\s*\(keybinds\.toggleMouseVisibility)'
match = re.search(pattern, content, re.DOTALL)

if match:
    old_block = match.group(1)
    new_block = """globalShortcut.register(keybinds.momentaryStealth, () => {
                if (!mainWindow || mainWindow.isDestroyed()) return;
                
                // --- ROBUST BINARY TOGGLE LOGIC (0 or 1) ---
                if (!stealthActive) {
                    // STATE 1: Turn ON Red Arrow, Freeze Real Cursor (Loading Spinner)
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
"""
    content = content.replace(old_block, new_block)
    
    with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\utils\window.js', 'w', encoding='utf-8') as f:
        f.write(content)
    print("Successfully replaced momentaryStealth with robust toggle logic.")
else:
    print("Could not find momentaryStealth block to replace.")
