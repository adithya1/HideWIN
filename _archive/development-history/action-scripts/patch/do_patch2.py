import re

def patch():
    with open(r'c:\Users\akula\Downloads\Hide-WIN\patch_notes_1.js', 'r', encoding='utf-8') as f:
        text = f.read()

    # Refactor renderFullNoteView -> renderFullNoteView(noteId)
    text = text.replace('renderFullNoteView() {', 'renderFullNoteView(noteId) {')
    text = text.replace('if (!this.expandedNoteId) return \'\';', 'if (!noteId) return \'\';')
    text = text.replace('const note = this.notes.find(n => n.id === this.expandedNoteId);', 'const note = this.notes.find(n => n.id === noteId);')
    text = text.replace('class="full-note-editor"', 'class="full-note-editor" id="editor-${note.id}"')
    
    # Event handlers inside renderFullNoteView
    text = text.replace('@input=${(e) => this.handleTitleInput(e)}', '@input=${(e) => this.handleTitleInput(e, note.id)}')
    text = text.replace('@blur=${(e) => this.handleTitleBlur(e)}', '@blur=${(e) => this.handleTitleBlur(e, note.id)}')
    text = text.replace('@input=${e => this.handleEditorInput(e)}', '@input=${e => this.handleEditorInput(e, note.id)}')
    text = text.replace('@click=${() => this.expandedNoteId = null}', '@click=${() => this.closeTab(note.id)}')
    
    # Methods taking noteId
    text = text.replace('handleTitleInput(e) {', 'handleTitleInput(e, noteId) {')
    text = text.replace('handleTitleBlur(e) {', 'handleTitleBlur(e, noteId) {')
    text = text.replace('handleEditorInput(e) {', 'handleEditorInput(e, noteId) {')
    text = text.replace('execFormat(command, value = null) {', 'execFormat(command, value = null, noteId = this.activeTabId) {')

    # Replace all this.expandedNoteId inside these methods with noteId
    text = text.replace('n => n.id === this.expandedNoteId', 'n => n.id === (typeof noteId !== "undefined" ? noteId : this.activeTabId)')
    text = text.replace('n => n.id !== this.expandedNoteId', 'n => n.id !== (typeof noteId !== "undefined" ? noteId : this.activeTabId)')
    
    # Replace querySelector inside execFormat and others
    text = text.replace("querySelector('.full-note-editor')", "querySelector(noteId ? '#editor-' + noteId : '.full-note-editor')")

    # The format bar uses execFormat. Let's make sure it operates on activeTabId
    # execFormat gets called without noteId by the toolbar. We changed it to default to `noteId = this.activeTabId`.

    with open(r'c:\Users\akula\Downloads\Hide-WIN\patch_notes_2.js', 'w', encoding='utf-8') as f:
        f.write(text)

patch()
print("Done patch 2")
