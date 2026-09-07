import re

with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\index.js', 'r', encoding='utf-8') as f:
    content = f.read()

ipc_handler = """
    ipcMain.handle('pin-to-desktop', async (event, noteId, noteTitle) => {
        try {
            const { app, shell } = require('electron');
            const path = require('path');
            
            const desktopPath = app.getPath('desktop');
            const safeTitle = (noteTitle || 'Untitled').replace(/[\\\\/:*?"<>|]/g, '');
            const shortcutPath = path.join(desktopPath, `HideWin Note - ${safeTitle}.lnk`);
            
            const success = shell.writeShortcutLink(shortcutPath, {
                target: process.execPath,
                args: `${PROTOCOL_NAME}://note?id=${noteId}`,
                description: `Open HideWin Note: ${safeTitle}`
            });
            
            return { success };
        } catch (error) {
            console.error('Error creating desktop shortcut:', error);
            return { success: false, error: error.message };
        }
    });
"""

# Find a good place to inject the ipcMain handler
target_loc = "function setupGeneralIpcHandlers() {"
content = content.replace(target_loc, target_loc + "\n" + ipc_handler)

deep_link = """
        const url = new URL(urlStr);
        
        if (url.hostname === 'note') {
            const noteId = url.searchParams.get('id');
            if (noteId && mainWindow && !mainWindow.isDestroyed()) {
                mainWindow.webContents.send('deep-link-open-note', { id: noteId });
                if (mainWindow.isMinimized()) mainWindow.restore();
                mainWindow.show();
                mainWindow.focus();
            }
            return { success: true };
        }
"""
content = content.replace("const url = new URL(urlStr);", deep_link)

with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\index.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("Successfully injected pin-to-desktop")
