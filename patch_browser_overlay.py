with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\InviteView.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Add Browser Button
old_btns = """<button style="padding: 16px 24px; border: none; background: transparent; font-weight: 600; font-size: 14px; color: ${this.activeToolTab === 'notes' ? '#3b82f6' : '#6b7280'}; border-bottom: 3px solid ${this.activeToolTab === 'notes' ? '#3b82f6' : 'transparent'}; cursor: pointer;" @click=${() => this.activeToolTab = 'notes'}>AI Notes</button>
                                            <button style="padding: 16px 24px; border: none; background: transparent; font-weight: 600; font-size: 14px; color: ${this.activeToolTab === 'settings' ? '#3b82f6' : '#6b7280'}; border-bottom: 3px solid ${this.activeToolTab === 'settings' ? '#3b82f6' : 'transparent'}; cursor: pointer;" @click=${() => this.activeToolTab = 'settings'}>Settings</button>"""
                                            
new_btns = """<button style="padding: 16px 24px; border: none; background: transparent; font-weight: 600; font-size: 14px; color: ${this.activeToolTab === 'notes' ? '#3b82f6' : '#6b7280'}; border-bottom: 3px solid ${this.activeToolTab === 'notes' ? '#3b82f6' : 'transparent'}; cursor: pointer;" @click=${() => this.activeToolTab = 'notes'}>AI Notes</button>
                                            <button style="padding: 16px 24px; border: none; background: transparent; font-weight: 600; font-size: 14px; color: ${this.activeToolTab === 'browser' ? '#3b82f6' : '#6b7280'}; border-bottom: 3px solid ${this.activeToolTab === 'browser' ? '#3b82f6' : 'transparent'}; cursor: pointer;" @click=${() => this.activeToolTab = 'browser'}>Browser</button>
                                            <button style="padding: 16px 24px; border: none; background: transparent; font-weight: 600; font-size: 14px; color: ${this.activeToolTab === 'settings' ? '#3b82f6' : '#6b7280'}; border-bottom: 3px solid ${this.activeToolTab === 'settings' ? '#3b82f6' : 'transparent'}; cursor: pointer;" @click=${() => this.activeToolTab = 'settings'}>Settings</button>"""
content = content.replace(old_btns, new_btns)

# Add BrowseView embed
old_views = """${this.activeToolTab === 'notes' ? html`<notes-view></notes-view>` : ''}
                                            ${this.activeToolTab === 'settings' ? html`<settings-view></settings-view>` : ''}"""
                                            
new_views = """${this.activeToolTab === 'notes' ? html`<notes-view></notes-view>` : ''}
                                            ${this.activeToolTab === 'browser' ? html`<browse-view></browse-view>` : ''}
                                            ${this.activeToolTab === 'settings' ? html`<settings-view></settings-view>` : ''}"""
content = content.replace(old_views, new_views)

with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\InviteView.js', 'w', encoding='utf-8') as f:
    f.write(content)
print("Added Browser to Tools Overlay")
