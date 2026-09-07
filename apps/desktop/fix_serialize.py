with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\NotesView.js', 'r', encoding='utf-8') as f:
    content = f.read()

target = """    async saveNotes(skipUpdate = false) {
        try {
            await hideWin.storage.saveNotes(this.notes);"""

replacement = """    async saveNotes(skipUpdate = false) {
        try {
            const cleanNotes = JSON.parse(JSON.stringify(this.notes));
            await hideWin.storage.saveNotes(cleanNotes);"""

content = content.replace(target, replacement)

with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\NotesView.js', 'w', encoding='utf-8') as f:
    f.write(content)
print("Stripped non-serializable proxies in saveNotes")
