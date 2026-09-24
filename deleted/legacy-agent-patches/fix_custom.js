const fs = require('fs');
const path = require('path');

const customPath = path.join('C:', 'Users', 'akula', 'Downloads', 'Hide-WIN', 'Hide-Win-Master', 'src', 'components', 'views', 'AICustomizeView.js');
let custom = fs.readFileSync(customPath, 'utf8');

const regex = /<div class="grid-viewport">[\s\S]*?<\!-- Popup Focus Modal -->/;

const replacement = `<div class="grid-viewport">
                    <div class="\${this.viewMode === 'grid' ? 'profiles-grid' : 'notes-list'}">
                        \${filtered.map(p => {
                            const cardLabels = this.getDocLabelsForType(p.type || 'Job Interview');
                            return html\`
                                <div class="profile-card \${this.viewMode === 'list' ? 'list-mode' : ''}" @click=\${() => this.editProfile(p)}>
                                    <div class="card-body">
                                        <div class="title-row">
                                            <div class="title">\${p.userName || p.name || 'Unnamed Profile'}</div>
                                            <div class="type-badge">\${p.type || 'Job Interview'}</div>
                                        </div>
                                        <div class="doc-labels">
                                            \${cardLabels.map(lbl => html\`<div class="doc-label">\${lbl}</div>\`)}
                                        </div>
                                    </div>
                                    <div class="card-actions">
                                        <button class="action-btn danger" @click=\${(e) => this.deleteProfile(e, p.id)} title="Delete Profile">
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18"></path><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                                        </button>
                                    </div>
                                </div>
                            \`;
                        })}
                    </div>
                </div>

                <!-- Popup Focus Modal -->`;

if (regex.test(custom)) {
    custom = custom.replace(regex, replacement);
    fs.writeFileSync(customPath, custom, 'utf8');
    console.log("Fixed AICustomizeView.js!");
} else {
    console.log("Could not find the block to fix!");
}
