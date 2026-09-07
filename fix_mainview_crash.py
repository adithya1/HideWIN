import re

with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\MainView.js', 'r', encoding='utf-8') as f:
    content = f.read()

# I will find the _loadFromStorage function and fix it.
target_broken = """            // Load pinned notes (shortcuts)
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
            }

            this.requestUpdate();
        } catch (e) {
            console.error('Error loading MainView storage:', e);
        }
    }"""

fixed_load_storage = """            // Load pinned notes (shortcuts)
            this._loadingNotes = true;
            this.requestUpdate();
            this._notes = await hideWin.storage.getNotes().catch(() => []);
            this._loadingNotes = false;

            this.requestUpdate();
        } catch (e) {
            console.error('Error loading MainView storage:', e);
        }
    }

    async loadNotes() {
        this._loadingNotes = true;
        this.requestUpdate();
        this._notes = await hideWin.storage.getNotes().catch(() => []);
        this._loadingNotes = false;
        this.requestUpdate();
    }"""

content = content.replace(target_broken, fixed_load_storage)

# Now fix connectedCallback and disconnectedCallback
target_connected = """    async connectedCallback() {
        super.connectedCallback();
        document.addEventListener('keydown', this.boundKeydownHandler);"""

replacement_connected = """    async connectedCallback() {
        super.connectedCallback();
        document.addEventListener('keydown', this.boundKeydownHandler);
        
        this._boundLoadNotes = this.loadNotes.bind(this);
        window.addEventListener('notes-updated', this._boundLoadNotes);"""

content = content.replace(target_connected, replacement_connected)

target_disconnected = """    disconnectedCallback() {
        super.disconnectedCallback();
        document.removeEventListener('keydown', this.boundKeydownHandler);"""

replacement_disconnected = """    disconnectedCallback() {
        super.disconnectedCallback();
        if (this._boundLoadNotes) {
            window.removeEventListener('notes-updated', this._boundLoadNotes);
        }
        document.removeEventListener('keydown', this.boundKeydownHandler);"""

content = content.replace(target_disconnected, replacement_disconnected)


with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\MainView.js', 'w', encoding='utf-8') as f:
    f.write(content)
print("Fixed MainView.js corruption")
