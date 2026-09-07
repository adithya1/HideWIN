import re

def fix():
    with open(r'c:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\NotesView.js', 'r', encoding='utf-8') as f:
        text = f.read()

    window_controls_code = """
                    <div class="window-controls" style="display: flex; gap: 4px; padding-right: 8px;">
                        <button class="hdr-icon-btn" title="Minimize" @click=${() => this.dispatchEvent(new CustomEvent('minimize', { bubbles: true, composed: true }))}>
                            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                        </button>
                        <button class="hdr-icon-btn" title="Maximize & Split" @click=${() => { 
                            this.dispatchEvent(new CustomEvent('maximize', { bubbles: true, composed: true }));
                            if (this.openTabs.length > 1) {
                                this.splitTabId = this.openTabs.find(id => id !== this.activeTabId) || null;
                                this.requestUpdate();
                            }
                        }}>
                            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect></svg>
                        </button>
                        <button class="hdr-icon-btn" title="Close" style="color: #ef4444;" @click=${() => this.dispatchEvent(new CustomEvent('close-notes', { bubbles: true, composed: true }))}>
                            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                        </button>
                    </div>
"""

    # First, let's remove the window controls from renderTabsContainer.
    # We find the start and end of the window-controls div inside renderTabsContainer
    start_wc = text.find('<div class="window-controls"')
    if start_wc != -1:
        end_wc = text.find('</div>', text.find('</button>', start_wc + 500)) + 6
        text = text[:start_wc] + text[end_wc:]
        print("Removed from renderTabsContainer")

    # Now, let's insert it at the end of the notes-toolbar in render()
    # Find the end of notes-toolbar.
    # Look for the last item in notes-toolbar. The notes-toolbar has a search input.
    search_div_idx = text.find('<div class="search-container">')
    if search_div_idx != -1:
        end_search_div = text.find('</div>', search_div_idx) + 6
        # Insert window controls immediately after search container
        text = text[:end_search_div] + window_controls_code + text[end_search_div:]
        print("Inserted into notes-toolbar")
    else:
        print("Could not find search-container")

    with open(r'c:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\NotesView.js', 'w', encoding='utf-8') as f:
        f.write(text)

fix()
