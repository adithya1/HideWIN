const { app, BrowserWindow } = require('electron');
app.whenReady().then(() => {
    const win = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });
    win.loadURL('data:text/html,<html><body><script>window.hideWin = { success: true };</script><script type="module">console.log(hideWin.success); const {ipcRenderer} = require("electron"); ipcRenderer.send("done");</script></body></html>');
    
    const { ipcMain } = require('electron');
    ipcMain.on("done", () => app.quit());
});
