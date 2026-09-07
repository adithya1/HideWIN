with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\utils\window.js', 'r', encoding='utf-8') as f:
    content = f.read()

target = """        if (stealthCursorWindow && !stealthCursorWindow.isDestroyed()) {
            stealthCursorWindow.setOpacity(0);
            stealthCursorWindow.webContents.send('move-stealth-cursor-global', { x: -9999, y: -9999 });
            stealthCursorWindow.hide();
        }"""
rep = """        if (stealthCursorWindow && !stealthCursorWindow.isDestroyed()) {
            stealthCursorWindow.setOpacity(0);
            stealthCursorWindow.webContents.send('move-stealth-cursor-global', { x: -9999, y: -9999 });
            // Do NOT call .hide()! Frameless transparent windows bug out on Windows DWM if hidden and shown repeatedly.
        }"""
if target in content:
    content = content.replace(target, rep)
    with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\utils\window.js', 'w', encoding='utf-8') as f:
        f.write(content)
    print("Fixed stealthCursorWindow hide bug")
else:
    print("Target not found")
