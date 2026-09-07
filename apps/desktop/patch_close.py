import re

with open('src/index.js', 'r', encoding='utf-8') as f:
    code = f.read()

old_close = """    mainWindow.on('close', (event) => {
        if (sessionWindow && !sessionWindow.isDestroyed()) {"""

new_close = """    mainWindow.on('close', (event) => {
        if (!app.isQuiting) {
            event.preventDefault();
            mainWindow.hide();
            mainWindow.setSkipTaskbar(true);
            return;
        }

        if (sessionWindow && !sessionWindow.isDestroyed()) {"""

code = code.replace(old_close, new_close)

with open('src/index.js', 'w', encoding='utf-8') as f:
    f.write(code)

print("Patched index.js for close to tray")
