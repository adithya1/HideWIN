import os
import re

path = 'src/components/views/AICustomizeView.js'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

func = """
    renderProfileListRow(profile) {
        return html`
            <div class="list-row" @click=${() => this.openEditModal(profile)}>
                <div class="list-row-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                </div>
                <span class="list-row-title">${profile.userName || profile.name || 'User'}</span>
                <span style="font-size: 12px; color: var(--text-tertiary); flex: 1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${profile.type || 'Job Interview'}</span>
                <span class="list-row-type" style="background: rgba(99,102,241,0.1); color: #6366f1;">#${profile.numericId || ''}</span>
                <div style="display: flex; gap: 8px;">
                    <button class="action-btn-small edit" @click=${(e) => { e.stopPropagation(); this.openEditModal(profile); }} style="padding: 4px 8px; font-size: 11px;">Edit</button>
                    <button class="action-btn-small delete" @click=${(e) => { e.stopPropagation(); this.deleteProfile(profile.id); }} style="padding: 4px 8px; font-size: 11px;">Delete</button>
                </div>
            </div>
        `;
    }

    renderModal() {"""

content = content.replace("    renderModal() {", func)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
print("Injected renderProfileListRow")
