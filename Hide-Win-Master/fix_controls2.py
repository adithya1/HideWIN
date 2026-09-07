import re
with open(r'c:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\NotesView.js', 'r', encoding='utf-8') as f:
    text = f.read()

toolbar_search = r'<div class="search-box">.*?</div>'
replacement_toolbar = r'''\g<0>
                    <!-- OS Window Controls -->
                    <div class="window-controls" style="display: flex; gap: 4px; padding-left: 12px; margin-left: auto; align-items: center;">
                        <button class="notes-btn" title="Minimize" @click=${() => this.dispatchEvent(new CustomEvent('minimize', { bubbles: true, composed: true }))} style="color: #969696; border: none; background: transparent; cursor: pointer; padding: 4px;">
                            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                        </button>
                        <button class="notes-btn" title="Maximize & Split" @click=${() => { 
                            this.dispatchEvent(new CustomEvent('maximize', { bubbles: true, composed: true }));
                            if (this.openTabs && this.openTabs.length > 1) {
                                this.splitTabId = this.openTabs.find(id => id !== this.activeTabId) || null;
                                this.requestUpdate();
                            }
                        }} style="color: #969696; border: none; background: transparent; cursor: pointer; padding: 4px;">
                            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect></svg>
                        </button>
                        <button class="notes-btn" title="Close" style="color: #ef4444; border: none; background: transparent; cursor: pointer; padding: 4px;" @click=${() => this.dispatchEvent(new CustomEvent('close-notes', { bubbles: true, composed: true }))}>
                            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                        </button>
                    </div>
'''
text = re.sub(toolbar_search, replacement_toolbar, text, count=1, flags=re.DOTALL)

with open(r'c:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\NotesView.js', 'w', encoding='utf-8') as f:
    f.write(text)
print('Inserted window controls')
