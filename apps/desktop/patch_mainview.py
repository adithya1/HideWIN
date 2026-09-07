import re

with open('src/components/views/MainView.js', 'r', encoding='utf-8') as f:
    code = f.read()

# 1. Update CSS to hide overflow on home-container and prepare pinned-shortcuts-container
old_css = """        .home-container {
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            justify-content: flex-start;
            padding: 40px 60px;
            box-sizing: border-box;
            background: var(--bg-app);
            overflow-y: auto;"""

new_css = """        .home-container {
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            justify-content: flex-start;
            padding: 40px 60px;
            box-sizing: border-box;
            background: var(--bg-app);
            overflow-y: hidden; /* Hide global scrollbar on main window */
            
        }
        
        .pinned-shortcuts-wrapper {
            width: 100%;
            flex: 1;
            min-height: 0;
            display: flex;
            flex-direction: column;
        }
        
        .pinned-shortcuts-container {
            width: 100%;
            max-width: 100%;
            display: grid;
            gap: 16px;
            margin-top: 8px;
            padding: 24px;
            border: 1px solid var(--border);
            border-radius: 16px;
            background: var(--bg-surface);
            box-shadow: 0 4px 20px rgba(0,0,0,0.05);
            overflow-y: auto;
            flex: 1;
            align-content: start;
        }"""

code = code.replace(old_css, new_css)

# 2. Update HTML rendering logic inside render()
# Locate the render block
old_html_block = """                <div class="pinned-shortcuts-container" style="width: 100%; max-width: 100%; display: grid; grid-template-columns: repeat(auto-fill, 100px); gap: 16px; margin-top: 8px; padding: 24px; border: 1px solid var(--border); border-radius: 16px; background: var(--bg-surface); box-shadow: 0 4px 20px rgba(0,0,0,0.05);">
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
                                ${note.name || 'Untitled Document'}
                            </div>
                        </div>
                    `)}
                </div>"""

new_html_block = """                <div class="pinned-shortcuts-wrapper">
                    ${(() => {
                        const notes = this._notes || [];
                        const totalItems = notes.length + 1;
                        let itemSize = 100;
                        let iconSize = 24;
                        let svgSize = 12;
                        let fontSize = 11;
                        
                        if (totalItems > 18) {
                            itemSize = 55;
                            iconSize = 18;
                            svgSize = 10;
                            fontSize = 9;
                        } else if (totalItems > 8) {
                            itemSize = 75;
                            iconSize = 20;
                            svgSize = 11;
                            fontSize = 10;
                        }
                        
                        return html`
                            <div class="pinned-shortcuts-container" style="grid-template-columns: repeat(auto-fill, ${itemSize}px);">
                                <div class="pinned-shortcut-card" @click=${() => this.onNavigate('notes')} style="width: ${itemSize}px; height: ${itemSize}px; background: transparent; border: 2px dashed var(--border); border-radius: 12px; padding: 8px; cursor: pointer; transition: background 0.12s ease, border-color 0.12s ease, box-shadow 0.12s ease; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px; position: relative;" onmouseover="this.style.background='rgba(59, 130, 246, 0.05)'; this.style.borderColor='rgba(59, 130, 246, 0.4)'; " onmouseout="this.style.background='transparent'; this.style.borderColor='var(--border)'; ">
                                    <div style="width: ${iconSize}px; height: ${iconSize}px; border-radius: 50%; background: rgba(59, 130, 246, 0.1); display: flex; align-items: center; justify-content: center; color: #3b82f6; transition: transform 0.2s;">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="${svgSize}" height="${svgSize}"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                                    </div>
                                    <div style="font-size: ${fontSize}px; font-weight: 500; color: var(--text-primary); text-align: center;">
                                        Add
                                    </div>
                                </div>
                                ${notes.map(note => html`
                                    <div class="pinned-shortcut-card" @click=${() => this.onNavigate('notes')} style="width: ${itemSize}px; height: ${itemSize}px; background: rgba(120, 120, 120, 0.05); border: 1px solid var(--border); border-radius: 12px; padding: 8px; cursor: pointer; transition: background 0.12s ease, border-color 0.12s ease, box-shadow 0.12s ease; display: flex; flex-direction: column; gap: 4px; position: relative;" onmouseover="this.style.background='rgba(120, 120, 120, 0.08)'; this.style.borderColor='rgba(99, 102, 241, 0.4)'; this.style.boxShadow='0 12px 24px rgba(0,0,0,0.1), 0 0 0 1px rgba(99,102,241,0.2)';" onmouseout="this.style.background='rgba(120, 120, 120, 0.05)'; this.style.borderColor='var(--border)'; this.style.boxShadow='none';">
                                        <div style="display: flex; align-items: center; justify-content: center; width: 100%;">
                                            <div style="width: ${iconSize}px; height: ${iconSize}px; border-radius: 6px; background: rgba(59, 130, 246, 0.15); display: flex; align-items: center; justify-content: center; color: #3b82f6;">
                                                ${note.type === 'image' ? html`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="${svgSize}" height="${svgSize}"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>` : html`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="${svgSize}" height="${svgSize}"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>`}
                                            </div>
                                        </div>
                                        <div style="font-size: ${fontSize}px; font-weight: 600; color: var(--text-primary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-top: auto; text-align: center; width: 100%;">
                                            ${note.name || 'Untitled Document'}
                                        </div>
                                    </div>
                                `)}
                            </div>
                        `;
                    })()}
                </div>"""

# Safely replace
if old_html_block in code:
    code = code.replace(old_html_block, new_html_block)
else:
    print("Warning: Could not find exact HTML block to replace")
    # try regex or looser match just in case, but usually exact match is fine if we copy pasted

with open('src/components/views/MainView.js', 'w', encoding='utf-8') as f:
    f.write(code)

print("Patched MainView.js for auto-scaling notes and layout lock")
