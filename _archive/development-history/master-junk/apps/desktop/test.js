const { app, BrowserWindow } = require('electron');
app.whenReady().then(() => {
  const win = new BrowserWindow({show: false});
  console.log('setDisplayAffinity type:', typeof win.setDisplayAffinity);
  win.setDisplayAffinity('exclude-from-capture');
  console.log('Successfully called setDisplayAffinity');
  app.quit();
});
