import re

# 1. NotesView.js - Uses <style> inside render()
with open('src/components/views/NotesView.js', 'r', encoding='utf-8') as f:
    notes = f.read()

notes_mobile_css = """
        @media (max-width: 768px) {
            .toolbar {
                flex-direction: column !important;
                align-items: stretch !important;
                padding: 16px !important;
                gap: 12px !important;
                height: auto !important;
            }
            .toolbar > div:first-child {
                display: none !important;
            }
            .toolbar .search-container, .toolbar .search-container input {
                width: 100% !important;
                max-width: 100% !important;
            }
            .grid-viewport { padding: 16px !important; }
            .notes-grid { grid-template-columns: 1fr !important; gap: 16px !important; }
            .note-card { height: auto !important; min-height: 120px !important; }
            .list-row { padding: 16px !important; gap: 12px !important; flex-wrap: wrap; }
            .list-row-title { font-size: 16px !important; }
        }
"""
if "@media (max-width: 768px)" not in notes:
    notes = notes.replace("</style>", notes_mobile_css + "\n</style>")
    with open('src/components/views/NotesView.js', 'w', encoding='utf-8') as f:
        f.write(notes)
    print("NotesView fixed!")

# 2. HistoryView.js - Uses static get styles() { return css` ... `; }
with open('src/components/views/HistoryView.js', 'r', encoding='utf-8') as f:
    history = f.read()

history_mobile_css = """
        @media (max-width: 768px) {
            .notes-toolbar {
                flex-direction: column !important;
                align-items: stretch !important;
                padding: 16px !important;
                gap: 12px !important;
                height: auto !important;
            }
            .search-box { width: 100% !important; }
            .search-box input { width: 100% !important; }
            .grid-viewport { padding: 16px !important; }
            .notes-grid { grid-template-columns: 1fr !important; gap: 16px !important; }
            .session-card { flex-direction: column; align-items: flex-start; }
            .detail-top { padding: 16px !important; }
            .detail-info { font-size: 18px !important; }
        }
"""
if "@media (max-width: 768px)" not in history:
    history = re.sub(r'(\s*)(`;\s*\}\s*render\(\)\s*\{)', r'\1' + history_mobile_css + r'\2', history)
    with open('src/components/views/HistoryView.js', 'w', encoding='utf-8') as f:
        f.write(history)
    print("HistoryView fixed!")

# 3. BrowseView.js
with open('src/components/views/BrowseView.js', 'r', encoding='utf-8') as f:
    browse = f.read()

browse_mobile_css = """
        @media (max-width: 768px) {
            .tabs-bar { display: none !important; }
            .browser-toolbar {
                flex-wrap: wrap !important;
                padding: 12px 16px !important;
                gap: 12px !important;
                height: auto !important;
            }
            .address-bar-wrapper { width: 100% !important; order: -1; }
        }
"""
if "@media (max-width: 768px)" not in browse:
    # BrowseView might be static get styles() or static styles = css`
    if '`;\n    }\n\n    render()' in browse:
        browse = browse.replace('`;\n    }\n\n    render()', browse_mobile_css + '\n`;\n    }\n\n    render()')
    elif '];' in browse:
        browse = re.sub(r'(\s*)(`\s*\];\s*)', r'\1' + browse_mobile_css + r'\2', browse)
    else:
        # Just put it before render()
        browse = re.sub(r'(\s*)(`;?\s*(?:}\s*)?render\(\)\s*\{)', r'\1' + browse_mobile_css + r'\2', browse)
    
    with open('src/components/views/BrowseView.js', 'w', encoding='utf-8') as f:
        f.write(browse)
    print("BrowseView fixed!")

