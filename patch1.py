p = r"c:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\app\HideWinApp.js"
with open(p, "r", encoding="utf-8") as f:
    text = f.read()

import re
old_text = "window.hideWin.ipcRenderer.on('deep-link-auth-success', async (event, data) => {"
new_text = """window.hideWin.ipcRenderer.on('deep-link-open-note', (event, data) => {
                if (data && data.id) {
                    this.currentView = 'notes';
                    this.currentViewParams = { id: data.id };
                    this.requestUpdate();
                }
            });

            window.hideWin.ipcRenderer.on('deep-link-auth-success', async (event, data) => {"""

if old_text in text:
    text = text.replace(old_text, new_text)
    print("Added deep-link-open-note listener.")
else:
    print("Could not find deep-link-auth-success listener.")

with open(p, "w", encoding="utf-8") as f:
    f.write(text)
