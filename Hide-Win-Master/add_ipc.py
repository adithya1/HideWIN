import re

file_path = r'c:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\index.js'
with open(file_path, 'r', encoding='utf-8') as f:
    code = f.read()

new_ipc = '''
    ipcMain.handle('set-window-size', (event, { width, height }) => {
        if (mainWindow && !mainWindow.isDestroyed()) {
            mainWindow.setSize(width, height);
            return true;
        }
        return false;
    });

    ipcMain.handle('set-window-bounds', (event, bounds) => {
        if (mainWindow && !mainWindow.isDestroyed()) {
            mainWindow.setBounds(bounds);
            return true;
        }
        return false;
    });

    ipcMain.handle('get-window-bounds', (event) => {
        if (mainWindow && !mainWindow.isDestroyed()) {
            return mainWindow.getBounds();
        }
        return null;
    });
'''

# Find a good place to insert it
code = code.replace("ipcMain.handle('get-app-version'", new_ipc + "\n    ipcMain.handle('get-app-version'")

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(code)

print("SUCCESS")
