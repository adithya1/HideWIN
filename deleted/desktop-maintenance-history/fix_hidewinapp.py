import sys, re

file_path = r'c:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\app\HideWinApp.js'
with open(file_path, 'r', encoding='utf-8') as f:
    code = f.read()

# Fix handleStart
handle_start_regex = r"async handleStart\(modeCategory, profileId = ''\) \{.*?\n\s*await this\._handleStartSessionBackend\(\);\n\s*\}"
handle_start_replacement = r'''async handleStart(modeCategory, profileId = '') {
        if (!modeCategory || modeCategory === 'undefined' || modeCategory === 'null') {
            this.selectedModeCategory = '';
        } else {
            this.selectedModeCategory = modeCategory;
        }
        this.selectedProfile = profileId;

        if (window.require) {
            const { ipcRenderer } = window.require('electron');
            await ipcRenderer.invoke('start-session', { modeCategory: this.selectedModeCategory, profileId: this.selectedProfile });
        }
        
        await this._handleStartSessionBackend();
    }'''
code = re.sub(handle_start_regex, handle_start_replacement, code, flags=re.DOTALL)

# Remove windowType checks (e.g. if (this.windowType === 'session') ...)
# Just let it be. But wait, we should replace if (this.windowType === 'main') in HideWinAppRenderers.js

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(code)

