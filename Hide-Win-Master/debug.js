const { app, BrowserWindow } = require('electron');
const fs = require('fs');

app.whenReady().then(() => {
  const win = new BrowserWindow({ 
    show: false, 
    webPreferences: { 
      nodeIntegration: true, 
      contextIsolation: false 
    } 
  });
  
  win.webContents.on('console-message', (event, level, message, line, sourceId) => {
    fs.appendFileSync('error.log', `[${level}] ${message} at ${sourceId}:${line}\n`);
  });
  
  win.loadFile('src/index.html');
  
  setTimeout(() => app.quit(), 5000);
});
