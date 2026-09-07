with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\NotesView.js', 'r', encoding='utf-8') as f:
    content = f.read()

target = """    async deleteNote(id, e) {"""

replacement = """    async pinToHome(note, e) {
        if (e) {
            e.stopPropagation();
            e.preventDefault();
        }
        note.pinned = !note.pinned;
        if (note.pinned) {
            // Generate the desktop shortcut (fire and forget so it doesn't block the UI)
            try {
                const { ipcRenderer } = window.hideWin || window.require('electron');
                ipcRenderer.invoke('pin-to-desktop', note.id, note.title || 'Untitled Note').then(result => {
                    if (result && !result.success) console.error("Desktop shortcut generation failed:", result.error);
                }).catch(err => {
                    console.error("IPC invocation for pin-to-desktop failed:", err);
                });
            } catch (err) {
                console.error("Could not find ipcRenderer:", err);
            }
        }
        await this.saveNotes();
        window.dispatchEvent(new CustomEvent('notes-updated'));
        this.requestUpdate();
    }

    async deleteNote(id, e) {"""

content = content.replace(target, replacement)

with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\NotesView.js', 'w', encoding='utf-8') as f:
    f.write(content)
print("Re-injected pinToHome")
