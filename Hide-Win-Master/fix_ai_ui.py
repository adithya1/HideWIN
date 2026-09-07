import re

path = 'src/components/views/AICustomizeView.js'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Update the HTML
new_html = """
                <!-- Top Header Banner with Big Create Button -->
                <div class="notes-toolbar">
                    <div class="toolbar-actions">
                        <button class="notes-btn primary" @click=${() => this.openCreateModal()}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <line x1="12" y1="5" x2="12" y2="19"></line>
                                <line x1="5" y1="12" x2="19" y2="12"></line>
                            </svg>
                            New Profile
                        </button>
                    </div>

                    <div class="search-box">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="11" cy="11" r="8"></circle>
                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                        </svg>
                        <input
                            class="search-input"
                            type="text"
                            placeholder="Search Ram, Sam, Raj..."
                            .value=${this.searchQuery}
                            @input=${e => this.searchQuery = e.target.value}
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

# Replace the old top banner HTML
content = re.sub(r'<div class="profiles-header-banner">.*?</button>\s*<div class="search-box">.*?</div>\s*<div style="display: flex; gap: 4px; margin-left: 8px;">.*?</div>\s*</div>', new_html, content, flags=re.DOTALL)

# Add the CSS required by notes-toolbar to AICustomizeView.js if it isn't already there
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

            .notes-btn {
                display: inline-flex;
                align-items: center;
                gap: 6px;
                padding: 6px 14px;
                border-radius: 12px;
                font-size: var(--font-size-xs);
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
                background: var(--bg-surface);
                border: 1px solid var(--border);
                color: var(--text-primary);
            }

            .notes-btn:hover {
                transform: translateY(-1px);
                box-shadow: 0 4px 12px rgba(0,0,0,0.05);
                border-color: rgba(99, 102, 241, 0.3);
            }

            .notes-btn.primary {
                background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
                border: none;
                color: white;
                box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
            }

            .notes-btn.primary:hover {
                background: linear-gradient(135deg, #4f8cf6 0%, #3b82f6 100%);
                box-shadow: 0 6px 16px rgba(59, 130, 246, 0.4);
            }

            .notes-btn svg {
                width: 14px;
                height: 14px;
            }
"""

if ".notes-toolbar {" not in content:
    content = content.replace(".profiles-container {", new_css + "\n            .profiles-container {")

# Ensure .search-box looks like NotesView.js
search_css = """
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

if ".search-box {" not in content:
    content = content.replace(".profiles-container {", search_css + "\n            .profiles-container {")
else:
    # already there, maybe modify it if needed, but I'll replace it to be sure
    content = re.sub(r'\.search-box \{.*?\}', '.search-box {\n                flex: 1;\n                min-width: 200px;\n                max-width: 400px;\n                display: flex;\n                align-items: center;\n                background: rgba(255, 255, 255, 0.9);\n                border: 1px solid var(--border);\n                border-radius: 12px;\n                padding: 6px 12px;\n                transition: all 0.2s;\n            }', content, flags=re.DOTALL)
    
with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
print("AICustomizeView.js UI aligned")
