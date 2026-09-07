import re

def patch():
    with open(r'c:\Users\akula\Downloads\Hide-WIN\patch_notes_2.js', 'r', encoding='utf-8') as f:
        text = f.read()

    # Fix click handlers in list and grid views
    text = text.replace('this.expandedNoteId = note.id', 'this.openNoteTab(note.id)')

    # Replace the Content Area
    old_content_area = '''<!-- Content area -->
                ${filteredNotes.length === 0 ? html`'''
    
    new_content_area = '''<!-- Content area -->
                ${this.openTabs.length > 0 ? html`
                    ${this.renderTabsContainer()}
                ` : html`
                    <!-- Grid/List View -->
                    ${filteredNotes.length === 0 ? html`'''
                    
    if old_content_area in text:
        text = text.replace(old_content_area, new_content_area)
    else:
        print("Could not find old_content_area!")

    # Replace the Expanded View block
    old_expanded_view = '''<!-- Full-Window Expanded View -->
                ${this.renderFullNoteView()}
            </div>'''
            
    new_expanded_view = '''<!-- Full-Window Expanded View replaced by TabsContainer -->
                `}
            </div>'''
            
    if old_expanded_view in text:
        text = text.replace(old_expanded_view, new_expanded_view)
    else:
        # Note: patch 2 changed it to renderFullNoteView(noteId)
        text = text.replace('<!-- Full-Window Expanded View -->\n                ${this.renderFullNoteView(noteId)}\n            </div>', new_expanded_view)
        text = text.replace('<!-- Full-Window Expanded View -->\n                ${this.renderFullNoteView()}\n            </div>', new_expanded_view)

    tabs_container = '''
    renderTabsContainer() {
        return html`
            <div class="tabs-container">
                <div class="tabs-bar">
                    <button class="hdr-icon-btn" title="Back to Notes List" @click=${() => { this.activeTabId = null; this.openTabs = []; this.requestUpdate(); }}>
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
                    ${this.openTabs.length > 1 ? html`
                        <button class="hdr-icon-btn" title="Split View" @click=${() => {
                            if (this.splitTabId) {
                                this.splitTabId = null;
                            } else {
                                this.splitTabId = this.openTabs.find(id => id !== this.activeTabId) || null;
                            }
                            this.requestUpdate();
                        }}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="12" y1="3" x2="12" y2="21"></line></svg>
                        </button>
                    ` : ''}
                </div>
                <div class="tabs-content ${this.splitTabId ? 'split-view' : ''}">
                    ${this.splitTabId ? html`
                        <div class="split-pane">
                            ${this.renderFullNoteView(this.activeTabId)}
                        </div>
                        <div class="split-pane">
                            ${this.renderFullNoteView(this.splitTabId)}
                        </div>
                    ` : html`
                        ${this.renderFullNoteView(this.activeTabId)}
                    `}
                </div>
            </div>
        `;
    }
'''
    # insert renderTabsContainer before renderFullNoteView
    text = text.replace('renderFullNoteView(noteId) {', tabs_container + '\n    renderFullNoteView(noteId) {')

    css_inject = '''
            .tabs-container {
                display: flex;
                flex-direction: column;
                flex: 1;
                overflow: hidden;
                border-radius: 12px;
                background: #fff;
                border: 1px solid rgba(0,0,0,0.1);
            }
            .tabs-bar {
                display: flex;
                align-items: center;
                background: #f1f5f9;
                padding: 4px 8px;
                border-bottom: 1px solid #e2e8f0;
                overflow-x: auto;
            }
            .tabs-list {
                display: flex;
                align-items: center;
                gap: 4px;
            }
            .tab {
                display: flex;
                align-items: center;
                background: #e2e8f0;
                color: #475569;
                padding: 6px 12px;
                border-radius: 6px 6px 0 0;
                font-size: 13px;
                font-weight: 500;
                cursor: pointer;
                max-width: 150px;
                border: 1px solid transparent;
                border-bottom: none;
                transition: all 0.2s;
            }
            .tab.active {
                background: #fff;
                color: #0f172a;
                border-color: #e2e8f0;
                box-shadow: 0 -2px 10px rgba(0,0,0,0.02);
            }
            .tab.split {
                border-top: 2px solid #3b82f6;
            }
            .tab-title {
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                margin-right: 8px;
            }
            .tab-close {
                background: transparent;
                border: none;
                color: inherit;
                cursor: pointer;
                border-radius: 50%;
                width: 18px;
                height: 18px;
                display: flex;
                align-items: center;
                justify-content: center;
                opacity: 0.6;
            }
            .tab-close:hover {
                background: rgba(0,0,0,0.1);
                opacity: 1;
            }
            .tab-add {
                font-size: 18px;
                padding: 0 8px;
            }
            .tabs-content {
                display: flex;
                flex: 1;
                overflow: hidden;
            }
            .tabs-content.split-view {
                flex-direction: row;
            }
            .split-pane {
                flex: 1;
                overflow: hidden;
                display: flex;
                flex-direction: column;
                border-right: 1px solid #e2e8f0;
            }
            .split-pane:last-child {
                border-right: none;
            }
'''
    text = text.replace('.notes-container {', css_inject + '\n            .notes-container {')

    with open(r'c:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\NotesView.js', 'w', encoding='utf-8') as f:
        f.write(text)

patch()
print("Done patch 3")
