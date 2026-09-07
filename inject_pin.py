with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\NotesView.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Find a good place to insert the function, like before deleteNote
target = """    async deleteNote(id, e) {"""

replacement = """    async pinToHome(note, e) {
        if (e) {
            e.stopPropagation();
            e.preventDefault();
        }
        
        note.pinned = !note.pinned;
        
        if (note.pinned) {
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
        }
        
        // Save state and notify MainView to refresh Home tab
        await this.saveNotes();
        window.dispatchEvent(new CustomEvent('notes-updated'));
        this.requestUpdate();
    }

    async deleteNote(id, e) {"""

content = content.replace(target, replacement)

with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\NotesView.js', 'w', encoding='utf-8') as f:
    f.write(content)
print("Injected pinToHome function into NotesView.js")
