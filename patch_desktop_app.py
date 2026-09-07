with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\app\HideWinApp.js', 'r', encoding='utf-8') as f:
    content = f.read()

listener_target = """            ipcRenderer.on('force-restore-main-window', () => {
                this.isMainWindowMinimized = false;
                this.requestUpdate();
            });"""

listener_replacement = listener_target + """
            ipcRenderer.on('deep-link-open-note', (event, data) => {
                if (data && data.id) {
                    this.isMainWindowMinimized = false;
                    this.currentView = 'notes';
                    this.currentViewParams = { id: data.id };
                    this.requestUpdate();
                }
            });
"""
content = content.replace(listener_target, listener_replacement)

with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\app\HideWinApp.js', 'w', encoding='utf-8') as f:
    f.write(content)
print("Added deep link listener for notes in HideWinApp.js")
