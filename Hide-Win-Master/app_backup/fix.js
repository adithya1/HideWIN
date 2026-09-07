const fs = require('fs');
const text = fs.readFileSync('src/utils/window.js', 'utf8');
const search = `    // Close/hide the stealth browser window from renderer
    ipcMain.on('hide-browser-window', () => {
                win.maximize();
            }
        }
    });


    ipcMain.handle('export-session-pdf', async (event, historyData) => {`;

const replace = `    // Close/hide the stealth browser window from renderer
    ipcMain.on('hide-browser-window', () => {
        if (stealthBrowserWindow && !stealthBrowserWindow.isDestroyed()) {
            stealthBrowserWindow.hide();
        }
    });

    ipcMain.handle('window-minimize', (event) => {
        const win = getWin(event);
        if (win && !win.isDestroyed()) {
            win.minimize();
        }
    });

    ipcMain.handle('minimize-to-bottom-left', (event, size) => {
        const win = getWin(event);
        if (win && !win.isDestroyed()) {
            const { screen } = require('electron');
            const display = screen.getPrimaryDisplay();
            const { height } = display.workAreaSize;
            win.setMinimumSize(1, 1);
            win.setBounds({
                x: 0,
                y: height - (size.height || 60),
                width: size.width || 280,
                height: size.height || 60
            });
        }
    });

    ipcMain.handle('set-window-bounds', (event, bounds) => {
        const win = getWin(event);
        if (win && !win.isDestroyed()) {
            const minW = bounds.minWidth || 1020;
            const minH = bounds.minHeight || 607;
            win.setMinimumSize(minW, minH);
            win.setBounds(bounds);
        }
    });

    ipcMain.handle('window-maximize', (event) => {
        const win = getWin(event);
        if (win && !win.isDestroyed()) {
            if (win.isMaximized()) {
                win.unmaximize();
            } else {
                win.maximize();
            }
        }
    });

    ipcMain.handle('export-session-pdf', async (event, historyData) => {`;

if (text.includes(search)) {
    console.log('Match found');
    fs.writeFileSync('src/utils/window.js', text.replace(search, replace));
} else if (text.replace(/\r\n/g, '\n').includes(search.replace(/\r\n/g, '\n'))) {
    console.log('Match found with CRLF normalization');
    fs.writeFileSync('src/utils/window.js', text.replace(/\r\n/g, '\n').replace(search.replace(/\r\n/g, '\n'), replace));
} else {
    console.log('No match found');
}
