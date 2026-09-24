with open('Hide-Win-Master/src/components/app/HideWinAppEvents.js', 'r', encoding='utf-8') as f:
    text = f.read()

old_code = '''                    this.isAuthenticated = true;
                    this._signInExpanded = false;
                    if (this.windowType === 'main') this.notifyPanelAuth(true);'''

new_code = '''                    this.isAuthenticated = true;
                    this._signInExpanded = false;
                    if (this.windowType === 'main') {
                        this.notifyPanelAuth(true);
                        // Auto-open main window after login success
                        if (window.hideWin && window.hideWin.ipcRenderer) {
                            window.hideWin.ipcRenderer.invoke('panel-open-main');
                        }
                    }'''

text = text.replace(old_code, new_code)

with open('Hide-Win-Master/src/components/app/HideWinAppEvents.js', 'w', encoding='utf-8') as f:
    f.write(text)
