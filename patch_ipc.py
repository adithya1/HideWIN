with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\index.js', 'r', encoding='utf-8') as f:
    content = f.read()

ipc_handler = """
    ipcMain.handle('set-always-on-top', (event, isAlwaysOnTop) => {
        const win = BrowserWindow.fromWebContents(event.sender);
        if (win) {
            win.setAlwaysOnTop(isAlwaysOnTop);
            return true;
        }
        return false;
    });
"""
content = content.replace("    ipcMain.handle('get-credentials', () => storage.getCredentials());", ipc_handler + "\n    ipcMain.handle('get-credentials', () => storage.getCredentials());")

with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\index.js', 'w', encoding='utf-8') as f:
    f.write(content)
print("Added set-always-on-top IPC handler to index.js")
