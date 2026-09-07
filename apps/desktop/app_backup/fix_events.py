import re

with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\utils\window.js', 'r', encoding='utf-8') as f:
    content = f.read()

target = """                if (line === 'LDOWN' || line === 'RDOWN') {
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
                } else if (line.startsWith('MOVE:')) {"""

rep = """                if (line === 'LDOWN' || line === 'LUP' || line === 'RDOWN' || line === 'RUP') {
                    const isDown = line.endsWith('DOWN');
                    const button = line.startsWith('L') ? 'left' : 'right';

                    const dotX = frozenScreenX + redDotDX;
                    const dotY = frozenScreenY + redDotDY;
                    
                    const windows = require('electron').BrowserWindow.getAllWindows();
                    let targetWin = null;
                    windows.forEach(win => {
                        if (win.isDestroyed() || !win.isVisible() || win === stealthCursorWindow || win === keyupWindow) return;
                        const b = win.getBounds();
                        if (dotX >= b.x && dotX <= b.x + b.width && dotY >= b.y && dotY <= b.y + b.height) {
                            targetWin = win;
                        }
                    });
                    
                    if (targetWin) {
                        if (isDown) {
                            const b = targetWin.getBounds();
                            targetWin.webContents.send('stealth-click-at', { x: dotX - b.x, y: dotY - b.y });
                            setTimeout(() => {
                                if (stealthCursorWindow && !stealthCursorWindow.isDestroyed()) {
                                    stealthCursorWindow.moveTop();
                                }
                            }, 50);
                        }
                    } else {
                        const robot = require('robotjs');
                        robot.mouseToggle(isDown ? 'down' : 'up', button);
                    }
                } else if (line.startsWith('WHEEL:')) {
                    const delta = parseInt(line.split(':')[1], 10);
                    const robot = require('robotjs');
                    const notches = Math.round(delta / 120);
                    if (notches !== 0) {
                        robot.scrollMouse(0, notches > 0 ? 1 : -1); 
                    }
                } else if (line.startsWith('MOVE:')) {"""

if target in content:
    content = content.replace(target, rep)
    with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\utils\window.js', 'w', encoding='utf-8') as f:
        f.write(content)
    print("Fixed LDOWN, LUP, WHEEL and stealth-click-at coordinates")
else:
    print("Target not found")
