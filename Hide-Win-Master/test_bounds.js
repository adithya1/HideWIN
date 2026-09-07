const { app, BrowserWindow } = require('electron');
app.whenReady().then(() => {
    const p = new BrowserWindow({width:200,height:200,x:100,y:100});
    const c = new BrowserWindow({width:100,height:100,x:300,y:300});
    c.setParentWindow(p);
    console.log("Parent bounds:", p.getBounds());
    console.log("Child bounds:", c.getBounds());
    setTimeout(()=>app.quit(), 500);
});
