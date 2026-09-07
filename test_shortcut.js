const { app, shell } = require('electron');
const path = require('path');

app.whenReady().then(() => {
    const desktopPath = app.getPath('desktop');
    const shortcutPath = path.join(desktopPath, `TestShortcut.lnk`);
    
    const success = shell.writeShortcutLink(shortcutPath, {
        target: process.execPath,
        args: 'hidewin://note?id=test',
        description: `Open HideWin Note`
    });
    console.log("Shortcut created:", success);
    app.quit();
});
