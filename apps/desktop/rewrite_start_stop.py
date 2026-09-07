import re

with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\utils\window.js', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. We need to extract the entire startStealthMode function block to replace it.
# It starts at "const startStealthMode = () => {" and goes until "const stopStealthMode = () => {"
match = re.search(r'    const startStealthMode = \(\) => \{.*?(?=    const stopStealthMode = \(\) => \{)', content, re.DOTALL)
if match:
    old_start = match.group(0)
    
    new_start = """    const ensureBlockerProcess = () => {
        if (blockerProcess) return;
        const { spawn } = require('child_process');
        blockerProcess = spawn(blockerExePath, [], { stdio: ['pipe', 'pipe', 'pipe'], windowsHide: true });
        
        let lineBuffer = '';
        blockerProcess.stdout.on('data', (chunk) => {
            lineBuffer += chunk.toString();
            const lines = lineBuffer.split('\n');
            lineBuffer = lines.pop();

            const { screen } = require('electron');
            const displays = screen.getAllDisplays();
            let minX = 0, minY = 0;
            displays.forEach(d => {
                if (d.bounds.x < minX) minX = d.bounds.x;
                if (d.bounds.y < minY) minY = d.bounds.y;
            });

            for (const raw of lines) {
                const line = raw.trim();
                if (!line || line === 'STARTED') continue;

                if (line === 'LDOWN' || line === 'RDOWN') {
                    const dotX = frozenScreenX + redDotDX;
                    const dotY = frozenScreenY + redDotDY;
                    
                    const windows = require('electron').BrowserWindow.getAllWindows();
                    let targetWin = null;
                    let targetWinZ = -9999;
                    windows.forEach(win => {
                        if (win.isDestroyed() || !win.isVisible() || win === stealthCursorWindow || win === keyupWindow) return;
                        const b = win.getBounds();
                        if (dotX >= b.x && dotX <= b.x + b.width && dotY >= b.y && dotY <= b.y + b.height) {
                            targetWin = win;
                        }
                    });
                    
                    if (targetWin) {
                        targetWin.webContents.send('stealth-click-at', { x: dotX, y: dotY });
                        setTimeout(() => {
                            if (stealthCursorWindow && !stealthCursorWindow.isDestroyed()) {
                                stealthCursorWindow.moveTop();
                            }
                        }, 50);
                    } else {
                        const robot = require('robotjs');
                        robot.mouseClick(line === 'LDOWN' ? 'left' : 'right');
                    }
                } else if (line.startsWith('MOVE')) {
                    const parts = line.split(' ');
                    if (parts.length === 3) {
                        redDotDX += parseInt(parts[1], 10);
                        redDotDY += parseInt(parts[2], 10);
                        if (stealthCursorWindow && !stealthCursorWindow.isDestroyed()) {
                            stealthCursorWindow.webContents.send('move-stealth-cursor-global', {
                                x: (frozenScreenX + redDotDX) - minX,
                                y: (frozenScreenY + redDotDY) - minY
                            });
                        }
                    }
                }
            }
        });
        
        blockerProcess.on('exit', () => { blockerProcess = null; });
    };

    const startStealthMode = () => {
        const { BrowserWindow, screen } = require('electron');
        const windows = BrowserWindow.getAllWindows();
        windows.forEach(win => {
            if (win.webContents.id === sessionWindowId && !win.isDestroyed()) {
                if (win.isMinimized()) win.restore();
            }
        });

        const curPos = screen.getCursorScreenPoint();
        frozenScreenX = curPos.x;
        frozenScreenY = curPos.y;
        redDotDX = 0;
        redDotDY = 0;

        try {
            if (!stealthCursorWindow || stealthCursorWindow.isDestroyed()) initHiddenWindows();
            
            const displays = screen.getAllDisplays();
            let minX = 0, minY = 0;
            displays.forEach(d => {
                if (d.bounds.x < minX) minX = d.bounds.x;
                if (d.bounds.y < minY) minY = d.bounds.y;
            });

            stealthCursorWindow.webContents.send('move-stealth-cursor-global', {
                x: frozenScreenX - minX,
                y: frozenScreenY - minY
            });
            stealthCursorWindow.setOpacity(1);
            stealthCursorWindow.showInactive();

            ensureBlockerProcess();
            if (blockerProcess && blockerProcess.stdin) {
                blockerProcess.stdin.write("LOCK\\n");
            }

            console.log('Stealth ON - cursor locked at', frozenScreenX, frozenScreenY);
        } catch (e) {
            console.error('Failed to start stealth mode:', e);
        }
    };
"""
    content = content.replace(old_start, new_start)
else:
    print("Failed to find startStealthMode")

# 2. Extract stopStealthMode
match2 = re.search(r'    const stopStealthMode = \(\) => \{.*?(?=    triggerAutoStealthStartFn = \(\) => \{)', content, re.DOTALL)
if match2:
    old_stop = match2.group(0)
    
    new_stop = """    const stopStealthMode = () => {
        if (stealthCursorWindow && !stealthCursorWindow.isDestroyed()) {
            stealthCursorWindow.setOpacity(0);
            stealthCursorWindow.webContents.send('move-stealth-cursor-global', { x: -9999, y: -9999 });
            stealthCursorWindow.hide();
        }
        if (keyupWindow && !keyupWindow.isDestroyed()) {
            keyupWindow.hide();
        }
        
        // INSTANTLY UNLOCK! No killing process!
        if (blockerProcess && blockerProcess.stdin) {
            try { blockerProcess.stdin.write("UNLOCK\\n"); } catch (e) {}
        }
        
        stealthActive = false;
        console.log('Stealth OFF - cursor released');
    };

"""
    content = content.replace(old_stop, new_stop)
else:
    print("Failed to find stopStealthMode")

# 3. Add ensureBlockerProcess() to triggerAutoStealthStartFn so it boots BEFORE Alt+A!
target_trigger = """    triggerAutoStealthStartFn = () => {
        try {
            // SWAP LOGIC: Only enable Ghost Mode (Real Mouse is free)"""

rep_trigger = """    triggerAutoStealthStartFn = () => {
        try {
            ensureBlockerProcess(); // Boot the engine in the background instantly!
            // SWAP LOGIC: Only enable Ghost Mode (Real Mouse is free)"""
content = content.replace(target_trigger, rep_trigger)

# 4. Completely kill process in triggerAutoStealthStopFn
target_trigger_stop = """    triggerAutoStealthStopFn = () => {
        try {
            if (stealthActive) {"""

rep_trigger_stop = """    triggerAutoStealthStopFn = () => {
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
            if (stealthActive) {"""
content = content.replace(target_trigger_stop, rep_trigger_stop)

with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\utils\window.js', 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated window.js")
