const { app, BrowserWindow } = require('electron');
app.whenReady().then(() => {
  const win = new BrowserWindow({show: false});
  console.log('methods:', Object.keys(Object.getPrototypeOf(win)).filter(k => k.toLowerCase().includes('protect') || k.toLowerCase().includes('affinity') || k.toLowerCase().includes('capture') || k.toLowerCase().includes('display')));
  app.quit();
});
