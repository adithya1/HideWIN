import re

with open('src/utils/window.js', 'r', encoding='utf-8') as f:
    code = f.read()

old_show = """                } else {
                    mainWindow.show();
                    mainWindow.setSkipTaskbar(false);
                    mainWindow.focus();"""

new_show = """                } else {
                    mainWindow.show();
                    mainWindow.setSkipTaskbar(false);
                    mainWindow.focus();
                    try {
                        const { setupTray } = require('./tray');
                        setupTray(mainWindow);
                    } catch(e) {}"""

code = code.replace(old_show, new_show)

with open('src/utils/window.js', 'w', encoding='utf-8') as f:
    f.write(code)

print("Patched window.js for tray recovery")
