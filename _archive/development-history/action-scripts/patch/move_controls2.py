import re

with open(r'c:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\NotesView.js', 'r', encoding='utf-8') as f:
    text = f.read()

tab_add_regex = r'(<button class="hdr-icon-btn tab-add" title="New Note" @click=\$\{.*?\}\)>\+</button>\s*</div>)'
note_controls = r'''\g<1>
                    <!-- Note-level Window Controls -->
                    <div class="window-controls" style="display: flex; gap: 4px; padding-right: 8px; align-items: center; margin-left: auto;">
                        <button class="notes-btn" title="Minimize Note to List" @click=${() => { this.activeTabId = null; this.requestUpdate(); }} style="color: #969696; border: none; background: transparent; cursor: pointer; padding: 4px;">
                            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                        </button>
                        <button class="notes-btn" title="Split Screen" @click=${() => { 
                            if (this.openTabs && this.openTabs.length > 1) {
                                this.splitTabId = this.openTabs.find(id => id !== this.activeTabId) || null;
                                this.requestUpdate();
                            }
                        }} style="color: #969696; border: none; background: transparent; cursor: pointer; padding: 4px;">
                            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect></svg>
                        </button>
                        <button class="notes-btn" title="Close Note" style="color: #ef4444; border: none; background: transparent; cursor: pointer; padding: 4px;" @click=${() => { if (this.activeTabId) this.closeTab(this.activeTabId); }}>
                            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                        </button>
                    </div>
'''
text = re.sub(tab_add_regex, note_controls, text)

with open(r'c:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\NotesView.js', 'w', encoding='utf-8') as f:
    f.write(text)
print("Updated controls")
