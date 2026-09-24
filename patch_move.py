with open('Hide-Win-Master/src/utils/window.js', 'r', encoding='utf-8') as f:
    text = f.read()

old_move_window = '''    ipcMain.handle('move-window', (event, { x, y }) => {
        const win = BrowserWindow.fromWebContents(event.sender);
        if (win && !win.isDestroyed()) {
            const nextX = Math.round(x);
            const nextY = Math.round(y);
            win.setPosition(nextX, nextY);
            if (win === mainWindowRef && controlPanelWindowRef && !controlPanelWindowRef.isDestroyed()) {
                const panelBounds = controlPanelWindowRef.getBounds();
                controlPanelWindowRef.setPosition(
                    Math.round(nextX + (win.getBounds().width - panelBounds.width) / 2),
                    nextY - panelBounds.height - 8
                );
            }
        }
        return { success: true };
    });'''

new_move_window = '''    ipcMain.handle('move-window', (event, { x, y }) => {
        const win = BrowserWindow.fromWebContents(event.sender);
        if (win && !win.isDestroyed()) {
            const nextX = Math.round(x);
            const nextY = Math.round(y);
            const winBounds = win.getBounds();
            win.setBounds({ x: nextX, y: nextY, width: winBounds.width, height: winBounds.height });
            if (win === mainWindowRef && controlPanelWindowRef && !controlPanelWindowRef.isDestroyed()) {
                const panelBounds = controlPanelWindowRef.getBounds();
                controlPanelWindowRef.setBounds({
                    x: Math.round(nextX + (winBounds.width - panelBounds.width) / 2),
                    y: nextY - panelBounds.height - 8,
                    width: panelBounds.width,
                    height: panelBounds.height
                });
            }
        }
        return { success: true };
    });'''

text = text.replace(old_move_window, new_move_window)

old_panel_move = '''    ipcMain.handle('panel-move-windows', (event, { x, y }) => {
        const panel = BrowserWindow.fromWebContents(event.sender);
        if (!panel || panel.isDestroyed()) return { success: false };
        const px = Math.round(x);
        const py = Math.round(y);
        panel.setPosition(px, py);
        if (mainWindowRef && !mainWindowRef.isDestroyed() && mainWindowRef.isVisible()) {
            const bounds = mainWindowRef.getBounds();
            mainWindowRef.setPosition(Math.round(px + (panel.getBounds().width - bounds.width) / 2), py + panel.getBounds().height + 8);
        }
        return { success: true };
    });'''

new_panel_move = '''    ipcMain.handle('panel-move-windows', (event, { x, y }) => {
        const panel = BrowserWindow.fromWebContents(event.sender);
        if (!panel || panel.isDestroyed()) return { success: false };
        const px = Math.round(x);
        const py = Math.round(y);
        const panelBounds = panel.getBounds();
        panel.setBounds({ x: px, y: py, width: panelBounds.width, height: panelBounds.height });
        if (mainWindowRef && !mainWindowRef.isDestroyed() && mainWindowRef.isVisible()) {
            const bounds = mainWindowRef.getBounds();
            mainWindowRef.setBounds({
                x: Math.round(px + (panelBounds.width - bounds.width) / 2),
                y: py + panelBounds.height + 8,
                width: bounds.width,
                height: bounds.height
            });
        }
        return { success: true };
    });'''

text = text.replace(old_panel_move, new_panel_move)

with open('Hide-Win-Master/src/utils/window.js', 'w', encoding='utf-8') as f:
    f.write(text)
