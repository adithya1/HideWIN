with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\NotesView.js', 'r', encoding='utf-8') as f:
    content = f.read()

target = """        if (note.pinned) {
            try {
                // Generate the desktop shortcut
                const { ipcRenderer } = window.hideWin || window.require('electron');
                const result = await ipcRenderer.invoke('pin-to-desktop', note.id, note.title || 'Untitled Note');
                if (!result.success) {
                    console.error("Desktop shortcut generation failed:", result.error);
                }
            } catch (err) {
                console.error("IPC invocation for pin-to-desktop failed:", err);
            }
        }"""

replacement = """        if (note.pinned) {
            // Generate the desktop shortcut (fire and forget so it doesn't block the UI)
            try {
                const { ipcRenderer } = window.hideWin || window.require('electron');
                ipcRenderer.invoke('pin-to-desktop', note.id, note.title || 'Untitled Note').then(result => {
                    if (!result.success) console.error("Desktop shortcut generation failed:", result.error);
                }).catch(err => {
                    console.error("IPC invocation for pin-to-desktop failed:", err);
                });
            } catch (err) {
                console.error("Could not find ipcRenderer:", err);
            }
        }"""

content = content.replace(target, replacement)

with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\NotesView.js', 'w', encoding='utf-8') as f:
    f.write(content)
print("Made Desktop shortcut creation fire-and-forget in NotesView.js")
