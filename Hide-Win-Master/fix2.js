const fs = require('fs');
const file = 'src/components/app/HideWinApp.js';
const text = fs.readFileSync(file, 'utf8');

const search = `            document.body.style.background = '';
            if (window.require && this._previousMainWindowBounds) {
                const { ipcRenderer } = window.require('electron');
            }
        } else {
            if (window.require) {`;

const replace = `            document.body.style.background = '';
            if (window.require && this._previousMainWindowBounds) {
                const { ipcRenderer } = window.require('electron');
                await ipcRenderer.invoke('set-window-bounds', { 
                    x: this._previousMainWindowBounds.x,
                    y: this._previousMainWindowBounds.y,
                    width: this._previousMainWindowBounds.width, 
                    height: this._previousMainWindowBounds.height,
                    minWidth: 1020, // Restore MIN_WINDOW_SIZE
                    minHeight: 607
                });
                // Restore theme for main window
                window.hideWin.theme.load();
                // Disable stealth mode
                await ipcRenderer.invoke('set-ignore-mouse-events', false);
            }
        } else {
            if (window.require) {`;

if (text.includes(search)) {
    fs.writeFileSync(file, text.replace(search, replace));
    console.log('Fixed HideWinApp.js');
} else if (text.replace(/\r\n/g, '\n').includes(search.replace(/\r\n/g, '\n'))) {
    fs.writeFileSync(file, text.replace(/\r\n/g, '\n').replace(search.replace(/\r\n/g, '\n'), replace));
    console.log('Fixed HideWinApp.js (CRLF)');
} else {
    console.log('Not found');
}
