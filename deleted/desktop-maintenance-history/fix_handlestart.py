import re

file_path = r'c:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\app\HideWinApp.js'
with open(file_path, 'r', encoding='utf-8') as f:
    code = f.read()

# Fix handleStart to NOT call start-session
start_str = "    async handleStart(modeCategory, profileId = '') {"
end_str = "    async _handleStartSessionBackend() {"
start_idx = code.find(start_str)
end_idx = code.find(end_str)

if start_idx != -1 and end_idx != -1:
    replacement = '''    async handleStart(modeCategory, profileId = '') {
        if (!modeCategory || modeCategory === 'undefined' || modeCategory === 'null') {
            this.selectedModeCategory = '';
        } else {
            this.selectedModeCategory = modeCategory;
        }
        this.selectedProfile = profileId;
        await this._handleStartSessionBackend();
    }

'''
    code = code[:start_idx] + replacement + code[end_idx:]

# Now fix startActualSession to call start-session before starting capture
start_str2 = "        hideWin.startCapture(this.selectedScreenshotInterval, this.selectedImageQuality);"
start_idx2 = code.find(start_str2)

if start_idx2 != -1:
    replacement2 = '''        if (window.require) {
            const { ipcRenderer } = window.require('electron');
            await ipcRenderer.invoke('start-session', { modeCategory: this.selectedModeCategory, profileId: this.selectedProfile });
        }
        hideWin.startCapture(this.selectedScreenshotInterval, this.selectedImageQuality);'''
    code = code[:start_idx2] + replacement2 + code[start_idx2 + len(start_str2):]

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(code)

print("SUCCESS")
