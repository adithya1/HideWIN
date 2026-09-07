with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\MainView.js', 'r', encoding='utf-8') as f:
    content = f.read()

target = """            // Load pinned notes (shortcuts)
            this._loadingNotes = true;
            this.requestUpdate();
            this._notes = await hideWin.storage.getNotes().catch(() => []);
            this._loadingNotes = false;"""

replacement = """            // Load pinned notes (shortcuts)
            this.loadNotes();
            
            if (!this._boundLoadNotes) {
                this._boundLoadNotes = this.loadNotes.bind(this);
                window.addEventListener('notes-updated', this._boundLoadNotes);
            }
        }

        async loadNotes() {
            this._loadingNotes = true;
            this.requestUpdate();
            this._notes = await hideWin.storage.getNotes().catch(() => []);
            this._loadingNotes = false;
            this.requestUpdate();
        }
        
        disconnectedCallback() {
            super.disconnectedCallback();
            if (this._boundLoadNotes) {
                window.removeEventListener('notes-updated', this._boundLoadNotes);
            }"""

content = content.replace(target, replacement)

with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\MainView.js', 'w', encoding='utf-8') as f:
    f.write(content)
print("Patched MainView.js to listen for notes updates")
