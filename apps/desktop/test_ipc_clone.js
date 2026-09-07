const { app, BrowserWindow, ipcMain } = require('electron');
app.whenReady().then(() => {
    const win = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });
    
    ipcMain.handle('storage:save-notes', (event, notes) => {
        console.log("RECEIVED:", notes);
        app.quit();
    });

    win.loadURL('data:text/html,<html><body><script>const {ipcRenderer} = require("electron"); const notes = [{id: "note_" + Date.now(), title: "Untitled Note", content: "", type: "text", createdAt: new Date().toLocaleDateString()}]; ipcRenderer.invoke("storage:save-notes", notes).catch(console.error);</script></body></html>');
});
