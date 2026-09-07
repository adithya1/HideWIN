const { app, shell } = require('electron');
const path = require('path');
const { execSync } = require('child_process');

app.whenReady().then(() => {
    const desktopPath = app.getPath('desktop');
    const shortcutPath = path.join(desktopPath, `TestShortcut2.lnk`);
    const target = process.execPath;
    const args = 'hidewin://note?id=test';
    
    // Test PowerShell way
    try {
        const psCommand = `$WshShell = New-Object -comObject WScript.Shell; $Shortcut = $WshShell.CreateShortcut('${shortcutPath}'); $Shortcut.TargetPath = '${target}'; $Shortcut.Arguments = '${args}'; $Shortcut.Save()`;
        execSync(`powershell -Command "${psCommand}"`, { stdio: 'inherit' });
        console.log("PS Shortcut created successfully");
    } catch (e) {
        console.log("PS failed", e);
    }
    app.quit();
});
