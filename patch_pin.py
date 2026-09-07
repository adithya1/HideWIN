with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\NotesView.js', 'r', encoding='utf-8') as f:
    content = f.read()

pin_func = """
    async pinToHome(note, e) {
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
    }
"""
content = content.replace("    async saveNotes(skipRender = false) {", pin_func + "\n    async saveNotes(skipRender = false) {")

# Add to Expanded View Header
expanded_target = """<button class="hdr-icon-btn danger" title="Delete" @click=${() => this.deleteNote(note.id)}>"""
expanded_replacement = """<button class="hdr-icon-btn" title=${note.pinned ? "Unpin from Home" : "Pin to Home"} @click=${e => this.pinToHome(note, e)} style="color: ${note.pinned ? '#3b82f6' : 'currentColor'};">
                              <svg viewBox="0 0 24 24" fill="${note.pinned ? '#3b82f6' : 'none'}" stroke="currentColor" stroke-width="2"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path></svg>
                          </button>\n                          """ + expanded_target
content = content.replace(expanded_target, expanded_replacement)

# Add to List View Actions
list_target = """<button class="row-action-btn delete" title="Delete" @click=${e => this.deleteNote(note.id, e)}>"""
list_replacement = """<button class="row-action-btn" title=${note.pinned ? "Unpin from Home" : "Pin to Home"} @click=${e => this.pinToHome(note, e)} style="color: ${note.pinned ? '#3b82f6' : 'currentColor'};">
                                          <svg viewBox="0 0 24 24" fill="${note.pinned ? '#3b82f6' : 'none'}" stroke="currentColor" stroke-width="2"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path></svg>
                                      </button>\n                                      """ + list_target
content = content.replace(list_target, list_replacement)

# Add to Grid View Actions
grid_target = """<button class="action-btn delete" title="Delete" @click=${e => this.deleteNote(note.id, e)}>"""
grid_replacement = """<button class="action-btn" title=${note.pinned ? "Unpin from Home" : "Pin to Home"} @click=${e => this.pinToHome(note, e)} style="color: ${note.pinned ? '#3b82f6' : 'currentColor'};">
                                                  <svg viewBox="0 0 24 24" fill="${note.pinned ? '#3b82f6' : 'none'}" stroke="currentColor" stroke-width="2"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path></svg>
                                              </button>\n                                              """ + grid_target
content = content.replace(grid_target, grid_replacement)

with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\NotesView.js', 'w', encoding='utf-8') as f:
    f.write(content)
print("Injected Pin to Home buttons into NotesView")
