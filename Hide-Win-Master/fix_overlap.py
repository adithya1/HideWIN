with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\utils\window.js', 'r', encoding='utf-8') as f:
    content = f.read()

target = """                    let targetWin = null;
                    windows.forEach(win => {
                        if (win.isDestroyed() || !win.isVisible() || win === stealthCursorWindow || win === keyupWindow) return;
                        const b = win.getContentBounds();
                        if (dotX >= b.x && dotX <= b.x + b.width && dotY >= b.y && dotY <= b.y + b.height) {
                            targetWin = win;
                        }
                    });
                    
                    if (targetWin) {
                        if (isDown) {
                            const b = targetWin.getContentBounds();
                            targetWin.webContents.send('stealth-click-at', { x: dotX - b.x, y: dotY - b.y });
                            setTimeout(() => {
                                if (stealthCursorWindow && !stealthCursorWindow.isDestroyed()) {
                                    stealthCursorWindow.moveTop();
                                }
                            }, 50);
                        }
                    } else {"""

rep = """                    let clickedApp = false;
                    windows.forEach(win => {
                        if (win.isDestroyed() || !win.isVisible() || win === stealthCursorWindow || win === keyupWindow) return;
                        const b = win.getContentBounds();
                        if (dotX >= b.x && dotX <= b.x + b.width && dotY >= b.y && dotY <= b.y + b.height) {
                            clickedApp = true;
                            if (isDown) {
                                win.webContents.send('stealth-click-at', { x: dotX - b.x, y: dotY - b.y });
                                setTimeout(() => {
                                    if (stealthCursorWindow && !stealthCursorWindow.isDestroyed()) {
                                        stealthCursorWindow.moveTop();
                                    }
                                }, 50);
                            }
                        }
                    });
                    
                    if (!clickedApp) {"""

if target in content:
    content = content.replace(target, rep)
    with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\utils\window.js', 'w', encoding='utf-8') as f:
        f.write(content)
    print("Fixed overlapping windows click bug")
else:
    print("Target not found")
