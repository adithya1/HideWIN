const fs = require('fs');
const path = require('path');

const customPath = path.join('C:', 'Users', 'akula', 'Downloads', 'Hide-WIN', 'Hide-Win-Master', 'src', 'components', 'views', 'AICustomizeView.js');
let custom = fs.readFileSync(customPath, 'utf8');

if (!custom.includes("this.viewMode = 'grid';")) {
    custom = custom.replace("this.searchQuery = '';", "this.searchQuery = '';\n        this.viewMode = 'grid';");
}
if (!custom.includes("viewMode: { type: String }")) {
    custom = custom.replace("searchQuery: { type: String },", "searchQuery: { type: String },\n            viewMode: { type: String },");
}

const stylesToInject = `
            .notes-toolbar { display: flex; align-items: center; justify-content: space-between; gap: var(--space-sm); background: rgba(255, 255, 255, 0.85); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); padding: var(--space-sm) var(--space-md); border-radius: 16px; border: 1px solid rgba(59, 130, 246, 0.2); box-shadow: 0 4px 24px -8px rgba(59, 130, 246, 0.15), inset 0 1px 1px rgba(255, 255, 255, 0.5); flex-wrap: wrap; color: #0f172a; margin-bottom: var(--space-md); }
            .icon-btn { display: inline-flex; align-items: center; justify-content: center; width: 36px; height: 36px; border-radius: 10px; border: 1px solid transparent; background: transparent; color: #64748b; cursor: pointer; transition: all 0.2s; }
            .icon-btn:hover { background: rgba(59, 130, 246, 0.1); color: #3b82f6; }
            .icon-btn.active { background: #ffffff; border-color: rgba(59, 130, 246, 0.3); color: #3b82f6; box-shadow: 0 2px 8px rgba(59, 130, 246, 0.1); }
            .icon-btn svg { width: 18px; height: 18px; }
            .notes-list { display: flex; flex-direction: column; gap: var(--space-sm); overflow-y: auto; }
            .profile-card.list-mode { display: flex; flex-direction: row; align-items: center; justify-content: space-between; padding: 12px 16px; height: auto; min-height: unset; gap: var(--space-md); }
            .profile-card.list-mode .card-body { padding: 0; flex: 1; flex-direction: row; align-items: center; gap: var(--space-md); }
            .profile-card.list-mode .title-row { margin-bottom: 0; flex: 1; }
            .profile-card.list-mode .doc-labels { justify-content: flex-end; }`;

if (!custom.includes('.notes-toolbar { display: flex;')) {
    custom = custom.replace('.search-box {', stylesToInject + '\n            .search-box {');
}

const newHeader = "                  <div class=\"notes-toolbar\">\n                      <div style=\"display:flex; gap:8px;\">\n                          <button class=\"start-btn\" style=\"width:auto; padding:8px 16px;\" @click=${this.createNewProfile}>\n                              <svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" style=\"width:16px;height:16px;margin-right:6px;vertical-align:-3px;\"><line x1=\"12\" y1=\"5\" x2=\"12\" y2=\"19\"></line><line x1=\"5\" y1=\"12\" x2=\"19\" y2=\"12\"></line></svg>\n                              New Profile\n                          </button>\n                      </div>\n\n                      <div class=\"search-box\">\n                          <svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\">\n                              <circle cx=\"11\" cy=\"11\" r=\"8\"></circle>\n                              <line x1=\"21\" y1=\"21\" x2=\"16.65\" y2=\"16.65\"></line>\n                          </svg>\n                          <input\n                              class=\"search-input\"\n                              type=\"text\"\n                              placeholder=\"Search Profiles...\"\n                              .value=${this.searchQuery}\n                              @input=${e => this.searchQuery = e.target.value}\n                          />\n                      </div>\n                      \n                      <div style=\"display:flex;gap:4px;flex-shrink:0;\">\n                          <button class=\"icon-btn ${this.viewMode === 'list' ? 'active' : ''}\" title=\"List view\" @click=${() => this.viewMode = 'list'}>\n                              <svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><line x1=\"3\" y1=\"6\" x2=\"21\" y2=\"6\"></line><line x1=\"3\" y1=\"12\" x2=\"21\" y2=\"12\"></line><line x1=\"3\" y1=\"18\" x2=\"21\" y2=\"18\"></line></svg>\n                          </button>\n                          <button class=\"icon-btn ${this.viewMode === 'grid' ? 'active' : ''}\" title=\"Grid view\" @click=${() => this.viewMode = 'grid'}>\n                              <svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><rect x=\"3\" y=\"3\" width=\"7\" height=\"7\"></rect><rect x=\"14\" y=\"3\" width=\"7\" height=\"7\"></rect><rect x=\"3\" y=\"14\" width=\"7\" height=\"7\"></rect><rect x=\"14\" y=\"14\" width=\"7\" height=\"7\"></rect></svg>\n                          </button>\n                      </div>\n                  </div>";

const oldHeaderRegex = /<div class="page-header-row">[\s\S]*?<\/div>\s*<\/div>/;
custom = custom.replace(oldHeaderRegex, newHeader);

const newList = "                <div class=\"grid-viewport\">\n                    <div class=\"${this.viewMode === 'grid' ? 'profiles-grid' : 'notes-list'}\">\n                        ${filtered.map(p => {\n                            const cardLabels = this.getDocLabelsForType(p.type || 'Job Interview');\n                            return html`\n                                <div class=\"profile-card ${this.viewMode === 'list' ? 'list-mode' : ''}\" @click=${() => this.editProfile(p)}>\n                                    <div class=\"card-body\">\n                                        <div class=\"title-row\">\n                                            <div class=\"title\">${p.userName || p.name || 'Unnamed Profile'}</div>\n                                            <div class=\"type-badge\">${p.type || 'Job Interview'}</div>\n                                        </div>\n                                        <div class=\"doc-labels\">\n                                            ${cardLabels.map(lbl => html`<div class=\"doc-label\">${lbl}</div>`)}\n                                        </div>\n                                    </div>\n                                    <div class=\"card-actions\">\n                                        <button class=\"action-btn danger\" @click=${(e) => this.deleteProfile(e, p.id)} title=\"Delete Profile\">\n                                            <svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><path d=\"M3 6h18\"></path><path d=\"M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2\"></path></svg>\n                                        </button>\n                                    </div>\n                                </div>\n                            `;\n                        })}\n                    </div>\n                </div>";

const listRegex = /<div class="grid-viewport">[\s\S]*?<\/div>\s*<\/div>/;
custom = custom.replace(listRegex, newList);

fs.writeFileSync(customPath, custom, 'utf8');
console.log("Custom UI updated!");
