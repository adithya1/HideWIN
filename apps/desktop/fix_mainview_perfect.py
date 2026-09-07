import re
import os

with open("src/components/views/MainView.js", "r", encoding="utf-8") as f:
    code = f.read()

# 1. Remove the stacked search bar from mobile (the user hated it)
code = re.sub(r'/\* Transform pill into stacked login-style inputs on mobile \*/.*?(?=\*/|</style>|`)', '', code, flags=re.DOTALL)
code = re.sub(r'\.action-bar-pill\s*\{[^}]*flex-direction:\s*column[^}]*\}', '', code, flags=re.DOTALL)

# 2. Inject the autoResizeNotes logic perfectly
target_container = r'<div class="pinned-shortcuts-container" style="width: 100%; max-width: 850px; max-height: 270px; overflow-y: auto; display: grid; grid-template-columns: repeat\(auto-fill, 100px\); gap: 16px; margin-top: 8px; padding: 24px; border: 1px solid var\(--border\); border-radius: 16px; background: var\(--bg-surface\); box-shadow: 0 4px 20px rgba\(0,0,0,0\.05\);">.*?<div class="pinned-shortcut-card"[^>]*>.*?<div class="shortcut-name">Add</div>.*?</div>.*?(?=\$\{notes\.map)'

replacement = """<div class="pinned-shortcuts-container">
                    ${(() => {
                        let itemSize = 100;
                        let iconSize = 48;
                        let svgSize = 24;
                        let fontSize = 13;
                        let subFontSize = 10;
                        const total = notes.length + 1;
                        if (total > 8 && total <= 18) { itemSize = 75; iconSize = 32; svgSize = 16; fontSize = 11; subFontSize = 9; }
                        else if (total > 18) { itemSize = 55; iconSize = 18; svgSize = 10; fontSize = 9; subFontSize = 8; }
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
                                    /* POSH LEAN SCROLLBAR */
                                    scrollbar-width: thin;
                                }
                                .pinned-shortcuts-container::-webkit-scrollbar { width: 6px; }
                                .pinned-shortcuts-container::-webkit-scrollbar-track { background: transparent; }
                                .pinned-shortcuts-container::-webkit-scrollbar-thumb { background-color: #d4d4d8; border-radius: 10px; }
                                .pinned-shortcuts-container::-webkit-scrollbar-thumb:hover { background-color: #a1a1aa; }
                                .pinned-shortcut-card {
                                    width: ${itemSize}px;
                                    height: ${itemSize}px;
                                    background: transparent;
                                    border: 2px dashed var(--border);
                                    border-radius: 12px;
                                    padding: 12px;
                                    cursor: pointer;
                                    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
                                    display: flex;
                                    flex-direction: column;
                                    align-items: center;
                                    justify-content: center;
                                    gap: 8px;
                                    position: relative;
                                }
                                .pinned-shortcut-card:hover {
                                    background: rgba(59, 130, 246, 0.05);
                                    border-color: rgba(59, 130, 246, 0.4);
                                    transform: translateY(-4px);
                                }
                                .shortcut-icon-wrapper {
                                    width: ${iconSize}px;
                                    height: ${iconSize}px;
                                    border-radius: 50%;
                                    background: rgba(59, 130, 246, 0.1);
                                    display: flex;
                                    align-items: center;
                                    justify-content: center;
                                    color: #3b82f6;
                                }
                                .shortcut-name {
                                    font-size: ${fontSize}px;
                                    font-weight: 500;
                                    color: var(--text-primary);
                                }
                            </style>
                            <div class="pinned-shortcut-card" @click=${() => this.onNavigate('notes')}>
                                <div class="shortcut-icon-wrapper add">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="${svgSize}" height="${svgSize}"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                                </div>
                                <div class="shortcut-name">Add</div>
                            </div>
                        `;
                    })()}
                    """

if re.search(target_container, code, flags=re.DOTALL):
    code = re.sub(target_container, replacement, code, flags=re.DOTALL)
    print("Successfully injected autoResizeNotes!")
else:
    print("WARNING: Could not find target HTML for autoResizeNotes")

# 3. Fix the inline map logic to also use the new sizing
target_map = r'\$\{notes\.map\(note => html`\s*<div class="pinned-shortcut-card".*?<div style="width: 48px; height: 48px;.*?<div style="font-size: 13px;.*?</svg></div>\s*</div>\s*</div>\s*`\)\}'

replacement_map = """${notes.map(note => html`
                        <div class="pinned-shortcut-card" @click=${() => this.onNavigate('notes')}>
                            <div class="shortcut-icon-wrapper" style="background: rgba(59, 130, 246, 0.05);">
                                <svg viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="1.5" width="50%" height="50%"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                            </div>
                            <div class="shortcut-name" style="text-align: center; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; width: 100%;">${note.title || 'New Note'}</div>
                            <div style="font-size: 0.8em; color: var(--text-secondary);">${note.type || 'TEXT NOTE'}</div>
                        </div>
                    `)}"""

if re.search(target_map, code, flags=re.DOTALL):
    code = re.sub(target_map, replacement_map, code, flags=re.DOTALL)
    print("Successfully injected map layout!")
else:
    print("WARNING: Could not find target map HTML")

with open("src/components/views/MainView.js", "w", encoding="utf-8") as f:
    f.write(code)
