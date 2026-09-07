import re

with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\NotesView.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Remove translateY from hover effects
content = re.sub(r'\btransform:\s*translateY\([^\)]+\);\n?', '', content)

# Adjust padding for list and grid
list_target = """            .notes-list {
                display: flex;
                flex-direction: column;
                gap: 2px;
                overflow-y: auto;
                flex: 1;
            }"""
list_replacement = """            .notes-list {
                display: flex;
                flex-direction: column;
                gap: 4px;
                padding: 0 16px 16px 16px;
                overflow-y: auto;
                flex: 1;
            }"""
content = content.replace(list_target, list_replacement)

grid_target = """            .grid-viewport {
                flex: 1;
                overflow-y: auto;
                overflow-x: hidden;
            }"""
grid_replacement = """            .grid-viewport {
                flex: 1;
                overflow-y: auto;
                overflow-x: hidden;
                padding: 0 16px 16px 16px;
            }"""
content = content.replace(grid_target, grid_replacement)

# Replace two toggle buttons with one
toggle_target = """                    <!-- View toggle -->
                    <div style="display:flex;gap:4px;flex-shrink:0;">
                        <button class="icon-btn ${this.viewMode === 'list' ? 'active' : ''}" title="List view" @click=${() => this.viewMode = 'list'}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
                        </button>
                        <button class="icon-btn ${this.viewMode === 'grid' ? 'active' : ''}" title="Grid view" @click=${() => this.viewMode = 'grid'}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect></svg>
                        </button>
                    </div>"""

toggle_replacement = """                    <!-- View toggle -->
                    <div style="display:flex;gap:4px;flex-shrink:0;padding-right:16px;">
                        <button class="icon-btn" title="Toggle View" @click=${() => this.viewMode = this.viewMode === 'list' ? 'grid' : 'list'}>
                            ${this.viewMode === 'list' 
                                ? html`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect></svg>`
                                : html`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>`
                            }
                        </button>
                    </div>"""
content = content.replace(toggle_target, toggle_replacement)

with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\NotesView.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("Applied UI fixes")
