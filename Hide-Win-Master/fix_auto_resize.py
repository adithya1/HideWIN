import re

with open("src/components/views/MainView.js", "r", encoding="utf-8") as f:
    code = f.read()

# Fix the action-bar-pill on mobile so it's not stacked
code = re.sub(r'\/\* Transform pill into stacked login-style inputs on mobile \*\/.*?gap: 16px !important;\s*\}', '', code, flags=re.DOTALL)

target_pattern = r'<div class="pinned-shortcuts-container".*?\$\{pinnedNotes\.map\(note => html`.*?Untitled Note\'\}[\s\S]*?</div>\s*</div>\s*`\)\}\s*</div>'

replacement = """<div class="pinned-shortcuts-container">
                    ${(() => {
                        let itemSize = 100;
                        let iconSize = 24;
                        let svgSize = 12;
                        let fontSize = 11;
                        let subFontSize = 9;
                        const total = pinnedNotes.length + 1;
                        if (total > 8 && total <= 18) { itemSize = 75; iconSize = 20; svgSize = 10; fontSize = 10; subFontSize = 8; }
                        else if (total > 18) { itemSize = 55; iconSize = 16; svgSize = 8; fontSize = 9; subFontSize = 7; }
                        return html`
                            <style>
                                .pinned-shortcuts-container {
                                    width: 100%;
                                    max-width: 850px;
                                    max-height: 270px;
                                    overflow-y: auto;
                                    display: grid;
                                    grid-template-columns: repeat(auto-fill, ${itemSize}px);
                                    gap: 16px;
                                    margin-top: 8px;
                                    padding: 24px;
                                    border: 1px solid var(--border);
                                    border-radius: 16px;
                                    background: var(--bg-surface);
                                    box-shadow: 0 4px 20px rgba(0,0,0,0.05);
                                    scrollbar-width: thin;
                                }
                                .pinned-shortcuts-container::-webkit-scrollbar { width: 6px; }
                                .pinned-shortcuts-container::-webkit-scrollbar-track { background: transparent; }
                                .pinned-shortcuts-container::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }
                                .pinned-shortcuts-container::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }
                            </style>
                            <div class="pinned-shortcut-card" @click=${() => this.onNavigate('notes')} style="width: ${itemSize}px; height: ${itemSize}px; background: transparent; border: 2px dashed var(--border); border-radius: 12px; padding: 12px; cursor: pointer; transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1); display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; position: relative;" onmouseover="this.style.background='rgba(59, 130, 246, 0.05)'; this.style.borderColor='rgba(59, 130, 246, 0.4)'; this.style.transform='translateY(-4px)';" onmouseout="this.style.background='transparent'; this.style.borderColor='var(--border)'; this.style.transform='translateY(0)';">
                                <div style="width: ${iconSize}px; height: ${iconSize}px; border-radius: 50%; background: rgba(59, 130, 246, 0.1); display: flex; align-items: center; justify-content: center; color: #3b82f6; transition: transform 0.2s;">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="${svgSize}" height="${svgSize}"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                                </div>
                                <div style="font-size: ${fontSize}px; font-weight: 500; color: var(--text-primary); text-align: center;">
                                    Add
                                </div>
                            </div>
                            ${pinnedNotes.map(note => html`
                                <div class="pinned-shortcut-card" @click=${() => this.openNoteViewer(note)} style="width: ${itemSize}px; height: ${itemSize}px; background: rgba(120, 120, 120, 0.05); border: 1px solid var(--border); border-radius: 12px; padding: 12px; cursor: pointer; transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1); display: flex; flex-direction: column; gap: 8px; position: relative;" onmouseover="this.style.background='rgba(120, 120, 120, 0.08)'; this.style.transform='translateY(-4px)'; this.style.borderColor='rgba(99, 102, 241, 0.4)'; this.style.boxShadow='0 12px 24px rgba(0,0,0,0.1), 0 0 0 1px rgba(99,102,241,0.2)';" onmouseout="this.style.background='rgba(120, 120, 120, 0.05)'; this.style.transform='translateY(0)'; this.style.borderColor='var(--border)'; this.style.boxShadow='none';">
                                    <button class="unpin-btn" title="Unpin from Home" @click=${(e) => { e.stopPropagation(); this._noteToUnpin = note; }} style="position: absolute; top: -6px; right: -6px; width: 20px; height: 20px; padding: 0;">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="12" height="12"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                    </button>
                                    <div style="display: flex; align-items: center; justify-content: center; width: 100%;">
                                        <div style="width: ${iconSize}px; height: ${iconSize}px; border-radius: 6px; background: rgba(59, 130, 246, 0.15); display: flex; align-items: center; justify-content: center; color: #3b82f6;">
                                            ${note.type === 'image' ? html`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="${svgSize}" height="${svgSize}"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>` : html`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="${svgSize}" height="${svgSize}"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>`}
                                        </div>
                                    </div>
                                    <div style="font-size: ${fontSize}px; font-weight: 600; color: var(--text-primary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-top: auto; text-align: center; width: 100%;">
                                        ${note.shortcutName || note.title || 'Untitled Note'}
                                    </div>
                                    <div style="font-size: ${subFontSize}px; color: var(--text-secondary); text-align: center; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; width: 100%; margin-top: -4px;">
                                        ${note.type === 'image' ? 'IMAGE NOTE' : 'TEXT NOTE'}
                                    </div>
                                </div>
                            `)}
                        `;
                    })()}
                </div>"""

if re.search(target_pattern, code, flags=re.DOTALL):
    code = re.sub(target_pattern, replacement, code, flags=re.DOTALL)
    print("SUCCESS: Injected auto-resizing pinned notes layout!")
else:
    print("FAILED: Could not find target HTML block")

with open("src/components/views/MainView.js", "w", encoding="utf-8") as f:
    f.write(code)
