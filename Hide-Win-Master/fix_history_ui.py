import re

path = 'src/components/views/HistoryView.js'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

new_html = """
            <!-- Header Toolbar -->
            <div class="notes-toolbar">
                <div class="toolbar-actions">
                    <div class="page-title" style="margin-right: 16px;">History</div>
                </div>

                <div class="search-box">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="11" cy="11" r="8"></circle>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                    <input
                        class="search-input"
                        type="text"
                        placeholder="Search past sessions..."
                        .value=${this.searchQuery}
                        @input=${this.handleSearchInput}
                    />
                </div>
                
                <div style="display:flex;gap:4px;flex-shrink:0;">
                    <button class="icon-btn ${this.viewMode === 'list' ? 'active' : ''}" title="List view" @click=${() => this.viewMode = 'list'}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
                    </button>
                    <button class="icon-btn ${this.viewMode === 'grid' ? 'active' : ''}" title="Grid view" @click=${() => this.viewMode = 'grid'}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect></svg>
                    </button>
                </div>
            </div>"""

# Replace the old top banner HTML in HistoryView.js
# The old one had:
#             <div class="page-header-row">
#                 <div class="page-title">History</div>
#             </div>
#             <div class="search-wrap" style="margin-bottom: var(--space-md); display: flex; gap: 8px;">
#                 ...
#             </div>
content = re.sub(r'<div class="page-header-row">.*?</div>\s*<div class="search-wrap".*?</div>\s*</div>', new_html, content, flags=re.DOTALL)


new_css = """
            .notes-toolbar {
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: var(--space-sm);
                background: rgba(255, 255, 255, 0.85);
                backdrop-filter: blur(16px);
                -webkit-backdrop-filter: blur(16px);
                padding: var(--space-sm) var(--space-md);
                border-radius: 16px;
                border: 1px solid rgba(59, 130, 246, 0.2);
                box-shadow: 0 4px 24px -8px rgba(59, 130, 246, 0.15), inset 0 1px 1px rgba(255, 255, 255, 0.5);
                flex-wrap: wrap;
                color: #0f172a;
                margin-bottom: var(--space-md);
            }

            .toolbar-actions {
                display: flex;
                align-items: center;
                gap: 8px;
            }

            .search-box {
                flex: 1;
                min-width: 200px;
                max-width: 400px;
                display: flex;
                align-items: center;
                background: rgba(255, 255, 255, 0.9);
                border: 1px solid var(--border);
                border-radius: 12px;
                padding: 6px 12px;
                transition: all 0.2s;
            }

            .search-box:focus-within {
                border-color: var(--accent);
                box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
            }

            .search-box svg {
                width: 16px;
                height: 16px;
                color: var(--text-muted);
                margin-right: 8px;
            }

            .search-input {
                flex: 1;
                border: none;
                background: transparent;
                outline: none;
                font-size: var(--font-size-sm);
                color: var(--text-primary);
                width: 100%;
            }
"""

if ".notes-toolbar {" not in content:
    content = content.replace(".history-container {", new_css + "\n            .history-container {")

# Also fix the list-row and notes-list css to exact match NotesView.js
list_css = """
            .notes-list {
                display: flex;
                flex-direction: column;
                gap: 8px;
                padding-bottom: 20px;
                width: 100%;
            }
            .list-row {
                display: flex;
                align-items: center;
                gap: 16px;
                padding: 12px 16px;
                background: var(--bg-surface);
                border: 1px solid var(--border);
                border-radius: var(--radius-md);
                cursor: pointer;
                transition: all 0.2s;
            }
            .list-row:hover {
                border-color: rgba(99, 102, 241, 0.4);
                background: rgba(99, 102, 241, 0.05);
                transform: translateX(4px);
            }
            .list-row-icon {
                width: 32px;
                height: 32px;
                border-radius: 8px;
                background: rgba(99, 102, 241, 0.1);
                color: #6366f1;
                display: flex;
                align-items: center;
                justify-content: center;
                flex-shrink: 0;
            }
            .list-row-title {
                font-weight: 600;
                font-size: 14px;
                color: var(--text-primary);
                flex: 1;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
            .list-row-type {
                font-size: 11px;
                font-weight: 600;
                padding: 4px 8px;
                border-radius: 4px;
                background: var(--bg-body);
                color: var(--text-secondary);
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }
"""

content = re.sub(r'\.notes-list\s*\{.*?\}', '', content, flags=re.DOTALL)
content = re.sub(r'\.list-row\s*\{.*?\}', '', content, flags=re.DOTALL)
content = content.replace(".profiles-grid {", list_css + "\n            .profiles-grid {")


with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
print("HistoryView.js UI aligned")
