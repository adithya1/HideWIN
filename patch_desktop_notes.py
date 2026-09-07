with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\NotesView.js', 'r', encoding='utf-8') as f:
    content = f.read()

pin_func_target = """    async pinToHome(note, e) {
        if (e) {
            e.stopPropagation();
            e.preventDefault();
        }
        const index = this.notes.findIndex(n => n.id === note.id);
        if (index > -1) {
            this.notes[index] = { ...this.notes[index], pinned: !this.notes[index].pinned, shortcutName: note.title || 'Untitled' };
            await this.saveNotes();
            this.requestUpdate();
        }
    }"""

pin_func_replacement = """    async pinToHome(note, e) {
        if (e) {
            e.stopPropagation();
            e.preventDefault();
        }
        
        // Also pin to Windows OS Desktop
        if (window.require) {
            const { ipcRenderer } = window.require('electron');
            await ipcRenderer.invoke('pin-to-desktop', note.id, note.title || 'Untitled');
            // Show toast notification
            this.dispatchEvent(new CustomEvent('global-toast', {
                detail: { message: `Pinned "${note.title || 'Untitled'}" to your Windows Desktop!`, type: 'success' },
                bubbles: true,
                composed: true
            }));
        }

        const index = this.notes.findIndex(n => n.id === note.id);
        if (index > -1) {
            this.notes[index] = { ...this.notes[index], pinned: true, shortcutName: note.title || 'Untitled' };
            await this.saveNotes();
            this.requestUpdate();
        }
    }"""

content = content.replace(pin_func_target, pin_func_replacement)

with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\NotesView.js', 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated NotesView.js to pin to Windows Desktop")
