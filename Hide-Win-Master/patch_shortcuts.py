import re

with open('src/utils/window.js', 'r', encoding='utf-8') as f:
    code = f.read()

# Add bossKey and emergencyErase to default keybinds
old_defaults = """        setMouseDetectable: isMac ? 'Cmd+Alt+A' : 'Ctrl+Alt+A',
        setMouseUndetectable: isMac ? 'Cmd+Alt+S' : 'Ctrl+Alt+S',"""
new_defaults = """        setMouseDetectable: isMac ? 'Cmd+Alt+A' : 'Ctrl+Alt+A',
        setMouseUndetectable: isMac ? 'Cmd+Alt+S' : 'Ctrl+Alt+S',
        bossKey: isMac ? 'Cmd+Shift+X' : 'Ctrl+Shift+X',
        emergencyErase: isMac ? 'Cmd+Shift+E' : 'Ctrl+Shift+E',"""
code = code.replace(old_defaults, new_defaults)

# Add setSkipTaskbar to toggleVisibility
old_toggle = """                    if (typeof stealthActive !== 'undefined' && stealthActive) {
                        stealthPaused = true;
                        stopStealthMode();
                    }
                    mainWindow.hide();
                } else {
                    mainWindow.show();
                    mainWindow.focus();"""
new_toggle = """                    if (typeof stealthActive !== 'undefined' && stealthActive) {
                        stealthPaused = true;
                        stopStealthMode();
                    }
                    mainWindow.hide();
                    mainWindow.setSkipTaskbar(true);
                } else {
                    mainWindow.show();
                    mainWindow.setSkipTaskbar(false);
                    mainWindow.focus();"""
code = code.replace(old_toggle, new_toggle)

# Add Panic Boss Key and Emergency Erase to updateGlobalShortcuts
injection = """
    // Panic Boss Key
    if (keybinds.bossKey) {
        try {
            globalShortcut.register(keybinds.bossKey, () => {
                console.log('PANIC BOSS KEY ACTIVATED!');
                if (mainWindow && !mainWindow.isDestroyed()) {
                    if (typeof stealthActive !== 'undefined' && stealthActive) {
                        stealthActive = false;
                        stopStealthMode();
                    }
                    mainWindow.hide();
                    mainWindow.setSkipTaskbar(true);
                    
                    // Kill audio capture by destroying gemini session
                    if (geminiSessionRef && geminiSessionRef.current) {
                        try {
                            const gemini = require('./gemini');
                            gemini.disconnectGemini(sendToRenderer, geminiSessionRef);
                        } catch(e) {}
                    }
                    
                    // Destroy Tray
                    try {
                        const { destroyTray } = require('./tray');
                        destroyTray();
                    } catch(e) {}
                }
            });
            console.log(`Registered bossKey: ${keybinds.bossKey}`);
        } catch (error) {
            console.error(`Failed to register bossKey:`, error);
        }
    }

    // Emergency Erase
    if (keybinds.emergencyErase) {
        try {
            globalShortcut.register(keybinds.emergencyErase, () => {
                console.log('EMERGENCY ERASE ACTIVATED!');
                try {
                    // Tell renderer to clear local state
                    if (mainWindow && !mainWindow.isDestroyed()) {
                        mainWindow.webContents.send('emergency-erase');
                    }
                    
                    // Clear backend storage
                    const storage = require('../storage');
                    storage.clearAll();
                    
                    // Force quit
                    const { app } = require('electron');
                    app.isQuiting = true;
                    app.quit();
                } catch(e) {
                    console.error('Emergency erase error', e);
                }
            });
            console.log(`Registered emergencyErase: ${keybinds.emergencyErase}`);
        } catch (error) {
            console.error(`Failed to register emergencyErase:`, error);
        }
    }
"""

# Insert before `// Unregister all existing shortcuts` ? NO, insert after the other keybind registrations!
# Let's find where to insert it.
insertion_point = "    // Register set undetectable shortcut"
code = code.replace(insertion_point, injection + "\n" + insertion_point)

with open('src/utils/window.js', 'w', encoding='utf-8') as f:
    f.write(code)

print("Patched window.js with Stealth features")
