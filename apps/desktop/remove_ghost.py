with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\utils\window.js', 'r', encoding='utf-8') as f:
    content = f.read()

import re

# 1. Strip from momentaryStealth
target_momentary = re.search(r'globalShortcut\.register\(keybinds\.momentaryStealth, \(\) => \{.*?(?=console\.log\(`Registered momentaryStealth)', content, re.DOTALL)
if target_momentary:
    new_momentary = """globalShortcut.register(keybinds.momentaryStealth, () => {
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
                    console.log("Alt+A: STATE 1 (Red Arrow ON, Real Mouse FROZEN)");
                } else {
                    // STATE 0: Turn OFF Red Arrow, Unfreeze Real Cursor
                    stealthActive = false;
                    
                    const windows = require('electron').BrowserWindow.getAllWindows();
                    windows.forEach(win => {
                        if (!win.isDestroyed()) win.webContents.send('toggle-mouse-visibility');
                    });
                    
                    stopStealthMode();
                    console.log("Alt+A: STATE 0 (Red Arrow OFF, Real Mouse FREE)");
                }
            });
            """
    content = content.replace(target_momentary.group(0), new_momentary)

# 2. Strip from triggerAutoStealthStartFn
target_start = re.search(r'triggerAutoStealthStartFn = \(\) => \{.*?(?=\};)', content, re.DOTALL)
if target_start:
    new_start = """triggerAutoStealthStartFn = () => {
        try {
            ensureBlockerProcess(); // Boot the engine in the background instantly!
        } catch(e) { console.error('Error auto-starting stealth:', e); }
    """
    content = content.replace(target_start.group(0), new_start)

# 3. Strip from triggerAutoStealthStopFn
target_stop = re.search(r'triggerAutoStealthStopFn = \(\) => \{.*?(?=\};)', content, re.DOTALL)
if target_stop:
    new_stop = """triggerAutoStealthStopFn = () => {
        try {
            if (blockerProcess) {
                try { 
                    if (blockerProcess.stdin) {
                        blockerProcess.stdin.write("EXIT\\n");
                        blockerProcess.stdin.end();
                    }
                    const pToKill = blockerProcess;
                    setTimeout(() => { try { pToKill.kill(); } catch (e) {} }, 200);
                } catch(e) {}
                blockerProcess = null;
            }
            if (stealthActive) {
                stealthActive = false;
                const windows = require('electron').BrowserWindow.getAllWindows();
                windows.forEach(win => { if (!win.isDestroyed()) win.webContents.send('toggle-mouse-visibility'); });
                stopStealthMode();
            }
        } catch(e) { console.error('Error auto-stopping stealth:', e); }
    """
    content = content.replace(target_stop.group(0), new_stop)

with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\utils\window.js', 'w', encoding='utf-8') as f:
    f.write(content)
print("Removed Ghost Mode logic")
