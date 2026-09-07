import re

def fix():
    with open(r'c:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\NotesView.js', 'r', encoding='utf-8') as f:
        text = f.read()

    # Find the start and end of renderTabsContainer
    idx_start = text.find('renderTabsContainer(filteredNotes) {')
    idx_end = text.find('    renderFullNoteView(noteId) {')

    if idx_start == -1 or idx_end == -1:
        print("Could not find renderTabsContainer")
        return

    # Extract the grid block again from the end of the file, cleanly.
    # Actually, the grid block at the end of the file is currently PERFECT.
    # Let's extract it from the render() method.
    render_start = text.find('<!-- Grid/List View -->', idx_end)
    render_end = text.find('</div>\n                    </div>\n                `}', render_start)
    if render_end == -1:
        print("Could not find grid block in render()")
        return
    
    grid_block = text[render_start:render_end + len('</div>\n                    </div>\n                `}')]

    # Build the clean renderTabsContainer
    clean_tabs = '''renderTabsContainer(filteredNotes) {
        return html`
            <div class="tabs-container">
                <div class="tabs-bar">
                    <button class="hdr-icon-btn" title="Back to Notes List" @click=${() => { this.activeTabId = null; this.requestUpdate(); }}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                    </button>
                    <div class="tabs-list">
                        ${this.openTabs.map(id => {
                            const note = this.notes.find(n => n.id === id) || { title: 'Unknown' };
                            const isActive = this.activeTabId === id;
                            const isSplit = this.splitTabId === id;
                            return html`
                                <div class="tab ${isActive ? 'active' : ''} ${isSplit ? 'split' : ''}" @click=${() => { this.activeTabId = id; this.requestUpdate(); }}>
                                    <span class="tab-title" title="${note.title || 'Untitled Note'}">${note.title || 'Untitled Note'}</span>
                                    <button class="tab-close" @click=${e => this.closeTab(id, e)}>
                                        <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                    </button>
                                </div>
                            `;
                        })}
                        <button class="hdr-icon-btn tab-add" title="New Note" @click=${() => this.createNote()}>+</button>
                    </div>
                    <div style="flex:1;"></div>
                    
                    <div class="window-controls" style="display: flex; gap: 4px; padding-right: 8px;">
                        <button class="hdr-icon-btn" title="Minimize" @click=${() => this.dispatchEvent(new CustomEvent('minimize', { bubbles: true, composed: true }))}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="19" x2="19" y2="19"></line></svg>
                        </button>
                        <button class="hdr-icon-btn" title="Maximize & Split" @click=${() => { 
                            this.dispatchEvent(new CustomEvent('maximize', { bubbles: true, composed: true }));
                            if (this.openTabs.length > 1) {
                                this.splitTabId = this.openTabs.find(id => id !== this.activeTabId) || null;
                                this.requestUpdate();
                            }
                        }}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect></svg>
                        </button>
                        <button class="hdr-icon-btn" title="Close Notes" style="color: #ef4444;" @click=${() => this.dispatchEvent(new CustomEvent('close-notes', { bubbles: true, composed: true }))}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                        </button>
                    </div>
                </div>
                <div class="tabs-content ${this.splitTabId && this.activeTabId ? 'split-view' : ''}" style="flex: 1; display: flex; flex-direction: column; overflow: hidden;">
                    ${!this.activeTabId ? html`
                        <div style="flex: 1; overflow-y: auto;">
                            MAGIC_GRID
                        </div>
                    ` : this.splitTabId ? html`
                        <div style="flex: 1; display: flex; flex-direction: row; overflow: hidden;">
                            <div class="split-pane">
                                ${this.renderFullNoteView(this.activeTabId)}
                            </div>
                            <div class="split-pane">
                                ${this.renderFullNoteView(this.splitTabId)}
                            </div>
                        </div>
                    ` : html`
                        <div style="flex: 1; display: flex; overflow: hidden;">
                            ${this.renderFullNoteView(this.activeTabId)}
                        </div>
                    `}
                </div>
            </div>
        `;
    }
'''

    clean_tabs = clean_tabs.replace('MAGIC_GRID', grid_block)

    text = text[:idx_start] + clean_tabs + text[idx_end:]

    with open(r'c:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\NotesView.js', 'w', encoding='utf-8') as f:
        f.write(text)

    print("Successfully rebuilt renderTabsContainer")

fix()
