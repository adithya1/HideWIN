import re

file_path = r'c:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\app\HideWinApp.js'
with open(file_path, 'r', encoding='utf-8') as f:
    code = f.read()

# Instead of regex, let's locate the handleClose function block.
start_str = "    async handleClose() {"
end_str = "    async _handleMinimize() {"

start_idx = code.find(start_str)
end_idx = code.find(end_str)

if start_idx != -1 and end_idx != -1:
    replacement = '''    async handleClose() {
        // If we are in a live session, just stop the session and go back to main menu
        if (this._isLiveMode()) {
            if (window.require) {
                const { ipcRenderer } = window.require('electron');
                const confirmed = await ipcRenderer.invoke('show-confirm-dialog', 'Are you sure you want to end the current session?');
                if (!confirmed) return;
                await ipcRenderer.invoke('close-session-window');
            }
            this.currentView = 'main';
            this.isSessionHidden = false;
            this.requestUpdate();
            return;
        }

        // If not in a session, close the app
        if (window.require) {
            const { ipcRenderer } = window.require('electron');
            await ipcRenderer.invoke('quit-application');
        }
    }

'''
    code = code[:start_idx] + replacement + code[end_idx:]
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(code)
    print("SUCCESS")
else:
    print("FAILED TO FIND")

