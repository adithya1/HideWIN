import re

file_path = r'c:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\app\HideWinApp.js'
with open(file_path, 'r', encoding='utf-8') as f:
    code = f.read()

replacement = '''
        const fs = require('fs');
        fs.appendFileSync('c:\\\\Users\\\\akula\\\\Downloads\\\\Hide-WIN\\\\Hide-Win-Master\\\\debug.log', 'startActualSession called\\n');
        
        if (window.require) {
            const { ipcRenderer } = window.require('electron');
            fs.appendFileSync('c:\\\\Users\\\\akula\\\\Downloads\\\\Hide-WIN\\\\Hide-Win-Master\\\\debug.log', 'Invoking start-session\\n');
            const res = await ipcRenderer.invoke('start-session', { modeCategory: this.selectedModeCategory, profileId: this.selectedProfile });
            fs.appendFileSync('c:\\\\Users\\\\akula\\\\Downloads\\\\Hide-WIN\\\\Hide-Win-Master\\\\debug.log', 'start-session returned: ' + JSON.stringify(res) + '\\n');
        }
        hideWin.startCapture(this.selectedScreenshotInterval, this.selectedImageQuality);
        if (this.responses.length === 0) {
            this.responses = [];
            this.currentResponseIndex = -1;
        }
        this.startTime = Date.now();
        this.sessionActive = true;
        this.currentView = 'assistant';
        fs.appendFileSync('c:\\\\Users\\\\akula\\\\Downloads\\\\Hide-WIN\\\\Hide-Win-Master\\\\debug.log', 'Set currentView to assistant\\n');
        this._startTimer();
'''

code = code.replace('''
        if (window.require) {
            const { ipcRenderer } = window.require('electron');
            await ipcRenderer.invoke('start-session', { modeCategory: this.selectedModeCategory, profileId: this.selectedProfile });
        }
        hideWin.startCapture(this.selectedScreenshotInterval, this.selectedImageQuality);
        if (this.responses.length === 0) {
            this.responses = [];
            this.currentResponseIndex = -1;
        }
        this.startTime = Date.now();
        this.sessionActive = true;
        this.currentView = 'assistant';
        this._startTimer();
''', replacement)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(code)

print("SUCCESS")
