import re

with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\MeetingDashboardView.js', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Remove all translateY bounce effects
content = re.sub(r'\btransform:\s*translateY\([^\)]+\);\n?', '', content)

# 2. Replace the FIRST view toggle (the two buttons) with a single toggle
toggle_target_1 = """                        <div style="display:flex;gap:4px;flex-shrink:0;">
                            <button class="icon-btn ${this.viewMode === 'list' ? 'active' : ''}" title="List view" @click=${() => this.viewMode = 'list'}>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
                            </button>
                            <button class="icon-btn ${this.viewMode === 'grid' ? 'active' : ''}" title="Grid view" @click=${() => this.viewMode = 'grid'}>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect></svg>
                            </button>
                        </div>"""

toggle_replacement_1 = """                        <div style="display:flex;gap:4px;flex-shrink:0;">
                            <button class="icon-btn" title="Toggle View" @click=${() => this.viewMode = this.viewMode === 'list' ? 'grid' : 'list'} style="background: var(--bg-surface); border: 1px solid var(--border); border-radius: 6px; padding: 4px; color: var(--text-secondary); cursor: pointer;">
                                ${this.viewMode === 'list' 
                                    ? html`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect></svg>`
                                    : html`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>`
                                }
                            </button>
                        </div>"""

content = content.replace(toggle_target_1, toggle_replacement_1)

# 3. Completely REMOVE the second set of view toggle buttons
toggle_target_2 = """                          <div style="display: flex; justify-content: flex-end; margin-bottom: 16px; gap: 8px;">
                              <button class="icon-btn ${this.viewMode === 'list' ? 'active' : ''}" style="border: 1px solid #e5e7eb; border-radius: 6px; padding: 6px; background: ${this.viewMode === 'list' ? '#e0e7ff' : '#fff'}; color: ${this.viewMode === 'list' ? '#4f46e5' : '#6b7280'}; cursor: pointer;" title="List view" @click=${() => this.viewMode = 'list'}>
                                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
                              </button>
                              <button class="icon-btn ${this.viewMode === 'grid' ? 'active' : ''}" style="border: 1px solid #e5e7eb; border-radius: 6px; padding: 6px; background: ${this.viewMode === 'grid' ? '#e0e7ff' : '#fff'}; color: ${this.viewMode === 'grid' ? '#4f46e5' : '#6b7280'}; cursor: pointer;" title="Grid view" @click=${() => this.viewMode = 'grid'}>
                                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
                              </button>
                          </div>"""

content = content.replace(toggle_target_2, "")

# 4. Make cards clickable (open meeting)
card_target = """                                  <div class="posh-card">"""
card_replace = """                                  <div class="posh-card" @click=${(e) => { if(!e.target.closest('button') && !e.target.closest('.posh-social-btn')) this.startMeeting(m); }} style="cursor: pointer;">"""
content = content.replace(card_target, card_replace)

list_target = """                                  <div class="posh-list-item">"""
list_replace = """                                  <div class="posh-list-item" @click=${(e) => { if(!e.target.closest('button') && !e.target.closest('.posh-social-btn')) this.startMeeting(m); }} style="cursor: pointer;">"""
content = content.replace(list_target, list_replace)

with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\MeetingDashboardView.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("Applied UI fixes to MeetingDashboardView")
