import re

with open('src/components/views/MainView.js', 'r', encoding='utf-8') as f:
    code = f.read()

# Add _notes property
code = code.replace('_sessions: { state: true },', '_sessions: { state: true },\n        _notes: { state: true },\n        _loadingNotes: { state: true },')

# Add loadNotes method
load_notes_method = '''
    async loadNotes() {
        this._loadingNotes = true;
        this.requestUpdate();
        this._notes = await hideWin.storage.getNotes().catch(() => []);
        this._loadingNotes = false;
        this.requestUpdate();
    }
'''
if 'async loadNotes()' not in code:
    code = code.replace('async connectedCallback() {', load_notes_method + '\n    async connectedCallback() {')

# Bind loadNotes in connectedCallback
if '_boundLoadNotes' not in code:
    code = code.replace('super.connectedCallback();', '''super.connectedCallback();
        this._boundLoadNotes = this.loadNotes.bind(this);
        window.addEventListener('notes-updated', this._boundLoadNotes);
        this.loadNotes();''')

# Unbind in disconnectedCallback
if 'window.removeEventListener(\\\'notes-updated\\\'' not in code:
    code = code.replace('super.disconnectedCallback();', '''super.disconnectedCallback();
        if (this._boundLoadNotes) {
            window.removeEventListener('notes-updated', this._boundLoadNotes);
        }''')

pinned_shortcuts_html = '''                <div class="home-subtext" style="margin-top: 16px; font-weight: 600; color: var(--text-primary);">
                    Pinned Shortcuts
                </div>
                <div class="pinned-shortcuts-container" style="width: 100%; max-width: 100%; max-height: 270px; overflow-y: auto; display: grid; grid-template-columns: repeat(auto-fill, 100px); gap: 16px; margin-top: 8px; padding: 24px; border: 1px solid var(--border); border-radius: 16px; background: var(--bg-surface); box-shadow: 0 4px 20px rgba(0,0,0,0.05);">
                    <div class="pinned-shortcut-card" @click=${() => this.onNavigate('notes')} style="width: 100px; height: 100px; background: transparent; border: 2px dashed var(--border); border-radius: 12px; padding: 12px; cursor: pointer; transition: background 0.12s ease, border-color 0.12s ease, box-shadow 0.12s ease; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; position: relative;" onmouseover="this.style.background='rgba(59, 130, 246, 0.05)'; this.style.borderColor='rgba(59, 130, 246, 0.4)'; " onmouseout="this.style.background='transparent'; this.style.borderColor='var(--border)'; ">
                        <div style="width: 24px; height: 24px; border-radius: 50%; background: rgba(59, 130, 246, 0.1); display: flex; align-items: center; justify-content: center; color: #3b82f6; transition: transform 0.2s;">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="12" height="12"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                        </div>
                        <div style="font-size: 11px; font-weight: 500; color: var(--text-primary); text-align: center;">
                            Add
                        </div>
                    </div>
                    ${(this._notes || []).slice(0,10).map(note => html`
                        <div class="pinned-shortcut-card" @click=${() => this.onNavigate('notes')} style="width: 100px; height: 100px; background: rgba(120, 120, 120, 0.05); border: 1px solid var(--border); border-radius: 12px; padding: 12px; cursor: pointer; transition: background 0.12s ease, border-color 0.12s ease, box-shadow 0.12s ease; display: flex; flex-direction: column; gap: 8px; position: relative;" onmouseover="this.style.background='rgba(120, 120, 120, 0.08)'; this.style.borderColor='rgba(99, 102, 241, 0.4)'; this.style.boxShadow='0 12px 24px rgba(0,0,0,0.1), 0 0 0 1px rgba(99,102,241,0.2)';" onmouseout="this.style.background='rgba(120, 120, 120, 0.05)'; this.style.borderColor='var(--border)'; this.style.boxShadow='none';">
                            <div style="display: flex; align-items: center; justify-content: center; width: 100%;">
                                <div style="width: 24px; height: 24px; border-radius: 6px; background: rgba(59, 130, 246, 0.15); display: flex; align-items: center; justify-content: center; color: #3b82f6;">
                                    ${note.type === 'image' ? html`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="12" height="12"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>` : html`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="12" height="12"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>`}
                                </div>
                            </div>
                            <div style="font-size: 11px; font-weight: 600; color: var(--text-primary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-top: auto; text-align: center; width: 100%;">
                                ${note.shortcutName || note.title || 'Untitled Note'}
                            </div>
                            <div style="font-size: 9px; color: var(--text-muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; text-transform: uppercase; letter-spacing: 0.5px; text-align: center; width: 100%;">
                                ${note.type === 'image' ? 'Image Note' : note.ext || 'Text Note'}
                            </div>
                        </div>
                    `)}
                </div>'''

# Replace everything from <div class="home-subtext"> to the end of the history list with Pinned Shortcuts!
pattern = r'<div class="home-subtext">.*?</div>\s*<div class="history-list-container">.*?</div>'
code = re.sub(pattern, pinned_shortcuts_html, code, flags=re.DOTALL)

with open('src/components/views/MainView.js', 'w', encoding='utf-8') as f:
    f.write(code)

print("Added Pinned Shortcuts to MainView.js!")
