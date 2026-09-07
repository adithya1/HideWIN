const { app, BrowserWindow } = require('electron');
const path = require('path');

app.whenReady().then(() => {
    const win = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    win.webContents.on('console-message', (event, level, message, line, sourceId) => {
        console.log(`[CONSOLE] ${message} (${sourceId}:${line})`);
    });

    win.loadFile(path.join(__dirname, '../src/index.html'));

    setTimeout(() => {
        app.quit();
    }, 3000);
});
