import re

with open(r'c:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\NotesView.js', 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Clean up the corrupted style block in handleMergedUpload
start_corrupted = text.find('.tabs-container {')
if start_corrupted != -1:
    end_corrupted = text.find('</style>', start_corrupted)
    # The actual end of the CSS is before </style>
    text = text[:start_corrupted] + text[end_corrupted:]
    print('Cleaned corrupted style block.')

# 2. Add window controls to the notes-toolbar
toolbar_search = r'<div class="search-container">.*?</div>'
replacement_toolbar = r'''\g<0>
                    <div class="window-controls" style="display: flex; gap: 4px; padding-left: 12px; margin-left: auto;">
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

# 3. Fix pinToHome to show a toast
pin_search = r"ipcRenderer\.invoke\('pin-to-desktop', note\.id, note\.title \|\| 'Untitled Note'\)\.then\(result => \{.*?\}\)\.catch\(err => \{.*?\}\);"
pin_replace = r"""ipcRenderer.invoke('pin-to-desktop', note.id, note.title || 'Untitled Note').then(result => {
                    if (result && !result.success) {
                        console.error("Desktop shortcut generation failed:", result.error);
                    } else {
                        // Show toast via main app
                        this.dispatchEvent(new CustomEvent('toast', { detail: 'Pinned to Desktop!', bubbles: true, composed: true }));
                    }
                }).catch(err => {
                    console.error("IPC invocation for pin-to-desktop failed:", err);
                });"""
text = re.sub(pin_search, pin_replace, text, flags=re.DOTALL)

# 4. Inject CSS styles at the very end of the HTML template before backticks
css = '''
            <style>
            .tabs-container {
                display: flex;
                flex-direction: column;
                height: 100%;
                width: 100%;
                background: #1e1e1e;
            }
            .tabs-bar {
                display: flex;
                flex-direction: row;
                align-items: center;
                background: #2d2d2d;
                border-bottom: 1px solid #3e3e42;
                height: 36px;
                flex-shrink: 0;
            }
            .tabs-list {
                display: flex;
                flex-direction: row;
                align-items: center;
                flex: 1;
                overflow-x: auto;
                height: 100%;
            }
            .tab {
                display: flex;
                align-items: center;
                height: 100%;
                padding: 0 12px;
                background: #2d2d2d;
                border-right: 1px solid #3e3e42;
                color: #969696;
                cursor: pointer;
                user-select: none;
                min-width: 120px;
                max-width: 200px;
            }
            .tab:hover {
                background: #333333;
            }
            .tab.active {
                background: #1e1e1e;
                color: #ffffff;
                border-top: 2px solid #007acc;
            }
            .tab.split {
                background: #1e1e1e;
                color: #ffffff;
                border-top: 2px solid #10b981;
            }
            .tab-title {
                flex: 1;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                font-size: 13px;
                margin-right: 8px;
            }
            .tab-close {
                display: flex;
                align-items: center;
                justify-content: center;
                width: 20px;
                height: 20px;
                border-radius: 3px;
                border: none;
                background: transparent;
                color: inherit;
                cursor: pointer;
                opacity: 0.6;
            }
            .tab-close:hover {
                background: rgba(255, 255, 255, 0.1);
                opacity: 1;
            }
            .tab-add {
                margin-left: 4px;
                font-size: 18px;
                opacity: 0.7;
            }
            .tab-add:hover {
                opacity: 1;
            }
            .split-view {
                display: flex;
                flex-direction: row !important;
            }
            .split-pane {
                flex: 1;
                border-right: 1px solid #3e3e42;
                display: flex;
                flex-direction: column;
                overflow: hidden;
            }
            .split-pane:last-child {
                border-right: none;
            }
            </style>
'''
end_html = text.rfind('`;\n    }\n}')
if end_html != -1:
    text = text[:end_html] + css + text[end_html:]
    print('Injected CSS styles correctly.')
else:
    print('Failed to inject CSS styles.')

with open(r'c:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\NotesView.js', 'w', encoding='utf-8') as f:
    f.write(text)
print('Patch applied successfully.')
