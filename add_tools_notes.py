import re

path_notes = r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\NotesView.js'
with open(path_notes, 'r', encoding='utf-8') as f:
    content = f.read()

# Add foreColor next to Highlight
fore_color_html = """</button>
                            <button class="toolbar-btn" title="Text Color" @click=${() => this.format('foreColor', '#185fc4')}>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="4 7 4 4 20 4 20 7"></polyline><line x1="9" y1="20" x2="15" y2="20"></line><line x1="12" y1="4" x2="12" y2="20"></line></svg>
                            </button>"""
content = re.sub(r'</button>\s*</div>\s*<div class="toolbar-divider"></div>\s*<div class="toolbar-group">\s*<button class="toolbar-btn" title="Bullet List"', fore_color_html + '\n                        </div>\n                        <div class="toolbar-divider"></div>\n                        <div class="toolbar-group">\n                            <button class="toolbar-btn" title="Bullet List"', content)

# Add Indent/Outdent next to Numbered List
indent_outdent_html = """</button>
                            <button class="toolbar-btn" title="Indent" @click=${() => this.format('indent')}>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line><line x1="11" y1="12" x2="21" y2="12"></line><polyline points="3 8 7 12 3 16"></polyline></svg>
                            </button>
                            <button class="toolbar-btn" title="Outdent" @click=${() => this.format('outdent')}>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line><line x1="11" y1="12" x2="21" y2="12"></line><polyline points="7 8 3 12 7 16"></polyline></svg>
                            </button>"""
content = re.sub(r'title="Numbered List".*?</button>', r'\g<0>' + indent_outdent_html, content, flags=re.DOTALL)


# Add Blockquote and Link before Code Block
blockquote_link_html = """<button class="toolbar-btn" title="Blockquote" @click=${() => this.format('formatBlock', 'BLOCKQUOTE')}>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"></path><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"></path></svg>
                            </button>
                            <button class="toolbar-btn" title="Insert Link" @click=${() => { const url = prompt('Enter URL:'); if(url) this.format('createLink', url); }}>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
                            </button>\n                            <button class="toolbar-btn" title="Code Block\""""
content = content.replace('<button class="toolbar-btn" title="Code Block"', blockquote_link_html)

with open(path_notes, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated NotesView.js")
