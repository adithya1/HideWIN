const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

app.whenReady().then(() => {
    const win = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    win.loadURL('data:text/html,<html><body><script>const {ipcRenderer} = require("electron"); ipcRenderer.invoke("test-pin").then(console.log).catch(console.error);</script></body></html>');
    
    ipcMain.handle('test-pin', async () => {
        const { exec } = require('child_process');
        const desktopPath = app.getPath('desktop');
        const shortcutPath = path.join(desktopPath, `HideWin_Test_Shortcut.lnk`);
        const targetPath = process.execPath;
        const args = `hidewin://note?id=123`;
        const psCommand = `$WshShell = New-Object -comObject WScript.Shell; $Shortcut = $WshShell.CreateShortcut('${shortcutPath}'); $Shortcut.TargetPath = '${targetPath}'; $Shortcut.Arguments = '${args}'; $Shortcut.Save()`;
        
        fs.writeFileSync('C:\\Users\\akula\\Downloads\\Hide-WIN\\test_ipc.log', `Running: ${psCommand}\n`);
        return new Promise((resolve) => {
            exec(`powershell -Command "${psCommand}"`, (error, stdout, stderr) => {
                if (error) {
                    fs.appendFileSync('C:\\Users\\akula\\Downloads\\Hide-WIN\\test_ipc.log', `Error: ${error.message}\nStderr: ${stderr}\n`);
                    resolve({ success: false, error: error.message });
                } else {
                    fs.appendFileSync('C:\\Users\\akula\\Downloads\\Hide-WIN\\test_ipc.log', `Success! stdout: ${stdout}\n`);
                    resolve({ success: true });
                }
                app.quit();
            });
        });
    });
});
