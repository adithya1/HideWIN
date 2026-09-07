with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\utils\window.js', 'r', encoding='utf-8') as f:
    content = f.read()

target_stop = """    const stopStealthMode = () => {
    if (stealthCursorWindow && !stealthCursorWindow.isDestroyed()) {
        stealthCursorWindow.hide();
    }"""

rep_stop = """    const stopStealthMode = () => {
    if (stealthCursorWindow && !stealthCursorWindow.isDestroyed()) {
        stealthCursorWindow.setOpacity(0);
        stealthCursorWindow.webContents.send('move-stealth-cursor-global', { x: -9999, y: -9999 });
        stealthCursorWindow.hide();
    }"""

target_start = """        stealthCursorWindow.showInactive();"""

rep_start = """        stealthCursorWindow.setOpacity(1);
        stealthCursorWindow.showInactive();"""

if target_stop in content:
    content = content.replace(target_stop, rep_stop)
    content = content.replace(target_start, rep_start)
    with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\utils\window.js', 'w', encoding='utf-8') as f:
        f.write(content)
    print("Fixed stealth cursor hiding")
else:
    print("Target not found")
