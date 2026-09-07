with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\NotesView.js', 'r', encoding='utf-8') as f:
    content = f.read()

target = """    async loadNotes() {
        try {
            this.notes = await hideWin.storage.getNotes();
        } catch (error) {
            console.error('Failed to load notes:', error);
        }
    }"""

replacement = """    async loadNotes() {
        try {
            const loaded = await hideWin.storage.getNotes();
            this.notes = loaded ? [...loaded] : [];
            this.requestUpdate();
        } catch (error) {
            console.error('Failed to load notes:', error);
        }
    }"""

content = content.replace(target, replacement)

with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\NotesView.js', 'w', encoding='utf-8') as f:
    f.write(content)
print("Forced requestUpdate in loadNotes")
