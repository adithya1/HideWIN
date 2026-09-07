import re

with open('src/components/views/MainView.js', 'r', encoding='utf-8') as f:
    code = f.read()

# Replace the notes map container layout
target_html = """<div class="pinned-shortcuts-container">
                                <div class="pinned-shortcut-card" @click=${() => this.onNavigate('notes')}>
                                    <div class="shortcut-icon-wrapper add">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="24" height="24"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                                    </div>
                                    <div class="shortcut-name">Add</div>
                                </div>
                                ${notes.map(note => html`"""

new_html = """${(() => {
                            let itemSize = 100;
                            let iconSize = 48;
                            let svgSize = 24;
                            let fontSize = 13;
                            let subFontSize = 10;
                            const total = notes.length + 1;
                            if (total > 8 && total <= 18) { itemSize = 75; iconSize = 32; svgSize = 16; fontSize = 11; subFontSize = 9; }
                            else if (total > 18) { itemSize = 55; iconSize = 18; svgSize = 10; fontSize = 9; subFontSize = 8; }
                            return html`
                            <div class="pinned-shortcuts-container" style="grid-template-columns: repeat(auto-fill, minmax(${itemSize}px, 1fr));">
                                <div class="pinned-shortcut-card" @click=${() => this.onNavigate('notes')} style="height: ${itemSize}px; padding: 4px;">
                                    <div class="shortcut-icon-wrapper add" style="width: ${iconSize}px; height: ${iconSize}px;">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="${svgSize}" height="${svgSize}"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                                    </div>
                                    <div class="shortcut-name" style="font-size: ${fontSize}px; margin-top: auto;">Add</div>
                                </div>
                                ${notes.map(note => html`"""

if target_html in code:
    code = code.replace(target_html, new_html)
    
    # Also patch the mapped note card
    note_target = """<div class="pinned-shortcut-card" @click=${() => this.onNavigate('notes')}>
                                        <div class="shortcut-icon-wrapper">
                                            ${note.type === 'image' ? html`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="24" height="24"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>` : html`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="24" height="24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>`}
                                        </div>
                                        <div class="shortcut-name">${note.shortcutName || note.title || 'Untitled Note'}</div>
                                        <div class="shortcut-type">${note.type === 'image' ? 'Image Note' : note.ext || 'Text Note'}</div>
                                    </div>"""
                                    
    note_new = """<div class="pinned-shortcut-card" @click=${() => this.onNavigate('notes')} style="height: ${itemSize}px; padding: 4px;">
                                        <div class="shortcut-icon-wrapper" style="width: ${iconSize}px; height: ${iconSize}px;">
                                            ${note.type === 'image' ? html`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="${svgSize}" height="${svgSize}"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>` : html`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="${svgSize}" height="${svgSize}"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>`}
                                        </div>
                                        <div class="shortcut-name" style="font-size: ${fontSize}px; margin-top: auto; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${note.shortcutName || note.title || 'Untitled Note'}</div>
                                        <div class="shortcut-type" style="font-size: ${subFontSize}px;">${note.type === 'image' ? 'Image Note' : note.ext || 'Text Note'}</div>
                                    </div>"""
                                    
    code = code.replace(note_target, note_new)
    
    # Close the IIFE
    end_target = """</div>
                        ` : html`
                            <div class="empty-state">"""
    end_new = """</div>
                            `;
                        })()
                        ` : html`
                            <div class="empty-state">"""
    code = code.replace(end_target, end_new)
    
    with open('src/components/views/MainView.js', 'w', encoding='utf-8') as f:
        f.write(code)
    print("Injected notes resize logic safely!")
else:
    print("Could not find target html in MainView.js")
