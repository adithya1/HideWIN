with open('Hide-Win-Master/src/components/app/HideWinApp.js', 'r', encoding='utf-8') as f:
    text = f.read()

old_code = '''    async _openSignIn() {
        if (this.windowType === 'panel' && window.require) {
            const { ipcRenderer } = window.require('electron');
            await ipcRenderer.invoke('panel-open-main');
            this._panelMainOpen = true;
            this.requestUpdate();
        }
    }'''

new_code = '''    async _openSignIn() {
        if (this.windowType === 'panel' && window.require) {
            const { ipcRenderer } = window.require('electron');
            const result = await ipcRenderer.invoke('panel-toggle-main');
            this._panelMainOpen = result?.visible !== false;
            this.requestUpdate();
        }
    }'''

text = text.replace(old_code, new_code)

with open('Hide-Win-Master/src/components/app/HideWinApp.js', 'w', encoding='utf-8') as f:
    f.write(text)
