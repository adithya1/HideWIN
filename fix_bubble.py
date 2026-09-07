with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\NotesView.js', 'r', encoding='utf-8') as f:
    content = f.read()

target1 = '<div class="list-row" @click=${() => this.expandedNoteId = note.id}>'
rep1 = '<div class="list-row" @click=${(e) => { if (!e.target.closest("button")) this.expandedNoteId = note.id; }}>'

target2 = '<div class="note-card" @click=${() => this.expandedNoteId = note.id}>'
rep2 = '<div class="note-card" @click=${(e) => { if (!e.target.closest("button")) this.expandedNoteId = note.id; }}>'

content = content.replace(target1, rep1)
content = content.replace(target2, rep2)

with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\NotesView.js', 'w', encoding='utf-8') as f:
    f.write(content)
print("Fixed bubbling issue for row click")
