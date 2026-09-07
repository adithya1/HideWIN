const { app, BrowserWindow, globalShortcut } = require('electron');

app.commandLine.appendSwitch('disable-features', 'PointerLockRequiresUserGesture');

app.whenReady().then(() => {
    const win = new BrowserWindow({
        width: 800, height: 600,
        webPreferences: { nodeIntegration: true, contextIsolation: false }
    });
    
    win.loadURL(`data:text/html;charset=utf-8,
        <html><body style="background: white;">
        <h1>Pointer Lock Test</h1>
        <div id="status">Waiting for Alt+L</div>
        <script>
            const { ipcRenderer } = require('electron');
            ipcRenderer.on('lock', () => {
                document.getElementById('status').innerText = 'Locking...';
                document.body.requestPointerLock();
            });
            document.addEventListener('pointerlockchange', () => {
                document.getElementById('status').innerText = 'Locked: ' + !!document.pointerLockElement;
                console.log("Locked:", !!document.pointerLockElement);
            });
            document.addEventListener('pointerlockerror', (e) => {
                document.getElementById('status').innerText = 'Lock ERROR';
                console.error("Lock error", e);
            });
        </script>
        </body></html>
    `);

    globalShortcut.register('Alt+L', () => {
        win.webContents.send('lock');
    });
    
    setTimeout(() => { app.quit(); }, 15000);
});
