import os
import re

path = 'src/components/views/AICustomizeView.js'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the top banner part
new_banner = """<div class="profiles-header-banner">
                    <button class="btn-create-big" @click=${() => this.openCreateModal()}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                            <line x1="12" y1="5" x2="12" y2="19"></line>
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                        + Create Profile
                    </button>

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
                    <div style="display: flex; gap: 4px; margin-left: 8px;">
                        <button class="icon-btn ${this.viewMode === 'list' ? 'active' : ''}" title="List view" @click=${() => this.viewMode = 'list'}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
                        </button>
                        <button class="icon-btn ${this.viewMode === 'grid' ? 'active' : ''}" title="Grid view" @click=${() => this.viewMode = 'grid'}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
                        </button>
                    </div>
                </div>"""

content = re.sub(r'<div class="profiles-header-banner">.*?</button>.*?<div class="search-box">.*?</div>.*?</div>', new_banner, content, flags=re.DOTALL)

# Replace the grid viewport part
new_viewport = """<!-- Viewport -->
                <div class="grid-viewport" style="flex: 1; overflow-y: auto;">
                    ${this.viewMode === 'list' ? html`
                        <div class="notes-list">
                            ${filtered.length > 0 
                                ? filtered.map(p => this.renderProfileListRow(p))
                                : html`
                                    <div class="empty-state" style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; color: var(--text-muted); gap: 12px; margin-top: 40px;">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                                        <div>No profiles found</div>
                                    </div>
                                `}
                        </div>
                    ` : html`
                        <div class="profiles-grid">
                            ${filtered.map(p => {
                                const cardLabels = this.getDocLabelsForType(p.type || 'Job Interview');
                                return html`
                                    <div
                                        class="profile-card ${this.selectedProfile === p.id ? 'active' : ''}"
                                        @click=${() => this.openEditModal(p)}
                                    >
                                        <div class="card-header">
                                            <span class="id-badge">User ID #${p.numericId || ''}</span>
                                            <span class="user-name">${p.userName || p.name || 'User'}</span>
                                            <span class="type-badge">${p.type || 'Job Interview'}</span>
                                        </div>

                                        <div class="card-details">
                                            <div class="detail-row">
                                                <span class="detail-label">${cardLabels.doc1}</span>
                                                ${p.resumeFileName ? html`<span class="file-tag">dY", ${p.resumeFileName}</span>` : html`<span class="snippet-text">${p.resumeContent || p.customPrompt || 'Default experience active'}</span>`}
                                            </div>

                                            <div class="detail-row">
                                                <span class="detail-label">${cardLabels.doc2}</span>
                                                ${p.jdFileName ? html`<span class="file-tag">dY", ${p.jdFileName}</span>` : html`<span class="snippet-text">${p.jdContent || 'Target details active'}</span>`}
                                            </div>
                                        </div>

                                        <div class="card-actions">
                                            <button class="action-btn-small delete" @click=${(e) => { e.stopPropagation(); this.deleteProfile(p.id); }}>Delete</button>
                                            <button class="action-btn-small edit" @click=${(e) => { e.stopPropagation(); this.openEditModal(p); }}>Edit</button>
                                        </div>
                                    </div>
                                `
                            })}
                        </div>
                    `}
                </div>"""

# Remove the old grid-viewport block, replacing it with the new one
content = re.sub(r'<!-- Grid Viewport -->.*?<div class="grid-viewport">.*?<div class="profiles-grid">.*?</div>\s*</div>\s*</div>', new_viewport + '\n            </div>', content, flags=re.DOTALL)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
print("AICustomizeView HTML updated")
