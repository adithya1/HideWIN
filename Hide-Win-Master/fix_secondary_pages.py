import re

# ================================
# 1. BrowseView.js
# ================================
with open('src/components/views/BrowseView.js', 'r', encoding='utf-8') as f:
    browse = f.read()

browse_mobile_css = """
        @media (max-width: 768px) {
            .tabs-bar { display: none !important; }
            .browser-toolbar {
                flex-wrap: wrap;
                padding: 12px 16px !important;
                gap: 12px !important;
                height: auto !important;
                background: var(--bg-surface);
            }
            .nav-btn {
                width: 40px !important;
                height: 40px !important;
                border-radius: 50% !important;
                background: var(--bg-app) !important;
            }
            .address-bar-wrapper {
                width: 100% !important;
                order: -1; /* Push to top */
            }
            .address-input {
                font-size: 16px !important;
                padding: 12px 16px !important;
                border-radius: 12px !important;
                background: var(--bg-app) !important;
            }
        }
"""
browse = browse.replace("/* --- Component Styles --- */", "/* --- Component Styles --- */\n" + browse_mobile_css)

with open('src/components/views/BrowseView.js', 'w', encoding='utf-8') as f:
    f.write(browse)

# ================================
# 2. NotesView.js
# ================================
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
                display: none !important; /* Hide 'Notes' title */
            }
            .toolbar .search-container {
                width: 100% !important;
                max-width: 100% !important;
            }
            .toolbar .search-container input {
                font-size: 16px !important;
                padding: 12px 16px 12px 36px !important;
                border-radius: 12px !important;
            }
            .toolbar button {
                width: 100% !important;
                padding: 12px !important;
                font-size: 16px !important;
                border-radius: 12px !important;
                justify-content: center !important;
            }
            .grid-viewport {
                padding: 16px !important;
            }
            .notes-grid {
                grid-template-columns: 1fr !important;
                gap: 16px !important;
            }
            .note-card {
                height: auto !important;
                min-height: 120px !important;
            }
            .list-row {
                padding: 16px !important;
                gap: 12px !important;
                flex-wrap: wrap;
            }
            .list-row-title { font-size: 16px !important; }
            .list-row-preview, .list-row-date { font-size: 13px !important; }
            .notes-container { padding: 0 !important; }
            
            /* Add note bottom sheet / sticky button */
            .upload-progress { margin-top: 12px !important; }
        }
"""
notes = notes.replace("/* --- Component Styles --- */", "/* --- Component Styles --- */\n" + notes_mobile_css)

# Hide desktop tooltips that conflict with mobile
notes = notes.replace('title="Copy"', '')
notes = notes.replace('title="Unpin from Home"', '')
notes = notes.replace('title="Pin to Home"', '')

with open('src/components/views/NotesView.js', 'w', encoding='utf-8') as f:
    f.write(notes)

# ================================
# 3. HistoryView.js
# ================================
with open('src/components/views/HistoryView.js', 'r', encoding='utf-8') as f:
    history = f.read()

history_mobile_css = """
        @media (max-width: 768px) {
            .toolbar {
                flex-direction: column !important;
                align-items: stretch !important;
                padding: 16px !important;
                gap: 12px !important;
                height: auto !important;
            }
            .toolbar > div:first-child {
                display: none !important; /* Hide 'History' title */
            }
            .toolbar .search-container {
                width: 100% !important;
                max-width: 100% !important;
            }
            .toolbar .search-container input {
                font-size: 16px !important;
                padding: 12px 16px 12px 36px !important;
                border-radius: 12px !important;
            }
            .grid-viewport {
                padding: 16px !important;
            }
            .notes-grid {
                grid-template-columns: 1fr !important;
                gap: 16px !important;
            }
            .note-card {
                height: auto !important;
                min-height: 120px !important;
            }
            .list-row {
                padding: 16px !important;
                gap: 12px !important;
                flex-wrap: wrap;
            }
            .list-row-title { font-size: 16px !important; }
            .list-row-preview { font-size: 13px !important; }
            
            .detail-top {
                padding: 16px !important;
            }
            .detail-info {
                font-size: 18px !important;
            }
            .tab-row {
                padding: 0 16px 16px 16px !important;
            }
            .tab-btn {
                flex: 1;
                font-size: 14px !important;
            }
            .chat-container {
                padding: 16px !important;
            }
        }
"""
history = history.replace("/* --- Component Styles --- */", "/* --- Component Styles --- */\n" + history_mobile_css)

with open('src/components/views/HistoryView.js', 'w', encoding='utf-8') as f:
    f.write(history)

print("Applied secondary pages mobile CSS.")
