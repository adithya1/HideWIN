const { Tray, Menu, app } = require('electron');
const path = require('path');

let tray = null;

function setupTray(mainWindow) {
    if (tray) return tray;

    const iconPath = path.join(__dirname, '../assets/images/logo.ico');
    tray = new Tray(iconPath);

    const contextMenu = Menu.buildFromTemplate([
        {
            label: 'Show/Hide HideWin',
            click: () => {
                if (mainWindow && !mainWindow.isDestroyed()) {
                    if (mainWindow.isVisible()) {
                        mainWindow.hide();
                        mainWindow.setSkipTaskbar(true);
                    } else {
                        mainWindow.show();
                        mainWindow.setSkipTaskbar(false);
                    }
                }
            }
        },
        { type: 'separator' },
        {
            label: 'Quit',
            click: () => {
                app.isQuiting = true; // Flag for window close event bypass
                app.quit();
            }
        }
    ]);

    tray.setToolTip('HideWin Stealth');
    tray.setContextMenu(contextMenu);

    tray.on('double-click', () => {
        if (mainWindow && !mainWindow.isDestroyed()) {
            if (mainWindow.isVisible()) {
                mainWindow.hide();
                mainWindow.setSkipTaskbar(true);
            } else {
                mainWindow.show();
                mainWindow.setSkipTaskbar(false);
            }
        }
    });

    return tray;
}

function destroyTray() {
    if (tray) {
        tray.destroy();
        tray = null;
    }
}

module.exports = {
    setupTray,
    destroyTray
};
