with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\NotesView.js', 'r', encoding='utf-8') as f:
    content = f.read()

target_pin = """        const index = this.notes.findIndex(n => n.id === note.id);
        if (index > -1) {
            this.notes[index] = { ...this.notes[index], pinned: true, shortcutName: note.title || 'Untitled' };
            await this.saveNotes();
            this.requestUpdate();
        }"""

replacement_pin = """        const index = this.notes.findIndex(n => n.id === note.id);
        if (index > -1) {
            this.notes[index] = { ...this.notes[index], pinned: !this.notes[index].pinned, shortcutName: note.title || 'Untitled' };
            await this.saveNotes();
            window.dispatchEvent(new CustomEvent('notes-updated'));
            this.requestUpdate();
        }"""

content = content.replace(target_pin, replacement_pin)

with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\NotesView.js', 'w', encoding='utf-8') as f:
    f.write(content)
print("Patched NotesView.js to dispatch notes-updated and toggle correctly")
