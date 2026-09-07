with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\InviteView.js', 'r', encoding='utf-8') as f:
    content = f.read()

tools_btn = """                                    <button class="meeting-action-btn ${this.showToolsOverlay ? 'active' : ''}" @click=${() => this.showToolsOverlay = !this.showToolsOverlay}>
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
                                        <span>Tools</span>
                                    </button>"""

content = content.replace("<span>Share</span>\n                                    </button>", "<span>Share</span>\n                                    </button>\n                                    \n" + tools_btn)

# Now, add the overlay itself
# The overlay should be inside the `posh-meeting-container` so it's scoped to the meeting, but absolutely positioned over it!
tools_overlay = """
                                <!-- Glassmorphism Tools Overlay -->
                                ${this.showToolsOverlay ? html`
                                    <div style="position: absolute; top: 70px; left: 0; right: 0; bottom: 0; background: rgba(255,255,255,0.7); backdrop-filter: blur(20px); z-index: 50; display: flex; flex-direction: column; animation: slideUp 0.3s cubic-bezier(0.16,1,0.3,1);">
                                        <div style="display: flex; background: rgba(255,255,255,0.9); border-bottom: 1px solid rgba(0,0,0,0.1); padding: 0 24px;">
                                            <button style="padding: 16px 24px; border: none; background: transparent; font-weight: 600; font-size: 14px; color: ${this.activeToolTab === 'notes' ? '#3b82f6' : '#6b7280'}; border-bottom: 3px solid ${this.activeToolTab === 'notes' ? '#3b82f6' : 'transparent'}; cursor: pointer;" @click=${() => this.activeToolTab = 'notes'}>AI Notes</button>
                                            <button style="padding: 16px 24px; border: none; background: transparent; font-weight: 600; font-size: 14px; color: ${this.activeToolTab === 'settings' ? '#3b82f6' : '#6b7280'}; border-bottom: 3px solid ${this.activeToolTab === 'settings' ? '#3b82f6' : 'transparent'}; cursor: pointer;" @click=${() => this.activeToolTab = 'settings'}>Settings</button>
                                            <button style="margin-left: auto; background: transparent; border: none; cursor: pointer; color: #4b5563;" @click=${() => this.showToolsOverlay = false}>
                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                            </button>
                                        </div>
                                        <div style="flex: 1; overflow: hidden; position: relative; background: rgba(249,250,251,0.5);">
                                            ${this.activeToolTab === 'notes' ? html`<notes-view></notes-view>` : ''}
                                            ${this.activeToolTab === 'settings' ? html`<settings-view></settings-view>` : ''}
                                        </div>
                                    </div>
                                ` : ''}
"""
# Insert right after `posh-meeting-container` opening tag
content = content.replace("<div class=\"posh-meeting-container\">", "<div class=\"posh-meeting-container\">\n" + tools_overlay)

with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\InviteView.js', 'w', encoding='utf-8') as f:
    f.write(content)
print("Injected Tools Overlay")
