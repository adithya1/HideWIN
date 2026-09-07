import re

# ==============================================================================
# 1. HIDEWIN APP (Global Header)
# ==============================================================================
with open('src/components/app/HideWinApp.js', 'r', encoding='utf-8') as f:
    app_code = f.read()

# Make the absolute header much smaller
app_code = re.sub(
    r'\.mobile-app-header\s*\{[^}]*height:\s*60px;[^}]*\}',
    r'''.mobile-app-header {
                position: absolute;
                top: 32px;
                left: 0;
                width: 100%;
                height: 40px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 0 8px;
                background: transparent !important;
                border-bottom: none !important;
                backdrop-filter: none !important;
                -webkit-backdrop-filter: none !important;
                z-index: 1000;
                pointer-events: none;
            }''',
    app_code
)

# Make the buttons tiny
app_code = re.sub(
    r'\.mobile-header-btn\s*\{[^}]*width:\s*36px;[^}]*height:\s*36px;[^}]*\}',
    r'''.mobile-header-btn {
                width: 28px;
                height: 28px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                color: var(--text-primary);
                cursor: pointer;
                transition: background 0.2s ease;
                pointer-events: auto !important;
                background: var(--bg-app) !important;
                border: 1px solid var(--border) !important;
                box-shadow: 0 2px 8px rgba(0,0,0,0.05) !important;
            }
            .mobile-header-btn svg { width: 14px; height: 14px; }
            .mobile-header-btn.avatar-btn { font-size: 10px !important; font-weight: 700; }
    ''',
    app_code, count=1
)

with open('src/components/app/HideWinApp.js', 'w', encoding='utf-8') as f:
    f.write(app_code)


# ==============================================================================
# 2. MAIN VIEW (Home Screen)
# ==============================================================================
with open('src/components/views/MainView.js', 'r', encoding='utf-8') as f:
    main = f.read()

# Replace padding
main = main.replace("padding: 76px 16px 16px 16px !important;", "padding: 44px 8px 8px 8px !important;")
main = main.replace("padding: 24px 20px 20px 20px !important;", "padding: 12px 12px 12px 12px !important;")
main = main.replace("height: 52px !important;", "height: 32px !important; font-size: 13px !important; border-radius: 8px !important;")
main = main.replace("margin: 24px 16px !important;", "margin: 8px !important; gap: 8px !important;")

with open('src/components/views/MainView.js', 'w', encoding='utf-8') as f:
    f.write(main)


# ==============================================================================
# 3. AI CUSTOMIZE VIEW (Profile Grid)
# ==============================================================================
with open('src/components/views/AICustomizeView.js', 'r', encoding='utf-8') as f:
    aic = f.read()

aic = aic.replace("padding: 16px 56px 16px 56px !important;", "padding: 6px 40px 6px 40px !important; gap: 6px !important;")
aic = aic.replace("padding: 12px 16px !important;", "padding: 6px 8px !important; font-size: 13px !important; height: 32px !important;")
# Small inputs
aic_css = """
        @media (max-width: 768px) {
            .search-container input, .action-btn {
                height: 32px !important;
                font-size: 12px !important;
                padding: 4px 8px !important;
                border-radius: 6px !important;
            }
            .notes-toolbar { padding: 6px 40px !important; gap: 6px !important; }
            .grid-viewport { padding: 8px !important; }
            .note-card { padding: 10px !important; min-height: 80px !important; }
            .card-title { font-size: 14px !important; }
            .card-content { font-size: 12px !important; }
            .notes-grid { gap: 8px !important; }
        }
"""
if "height: 32px !important;" not in aic:
    aic = aic.replace("        `\n    ];", aic_css + "\n        `\n    ];")

with open('src/components/views/AICustomizeView.js', 'w', encoding='utf-8') as f:
    f.write(aic)

# ==============================================================================
# 4. HISTORY VIEW (Session Logs)
# ==============================================================================
with open('src/components/views/HistoryView.js', 'r', encoding='utf-8') as f:
    hist = f.read()

# Remove the leaked CSS!
leaked_css = r"""\s*@media \(max-width: 768px\) \{\s*\.notes-toolbar \{\s*flex-direction: column !important;\s*align-items: stretch !important;\s*padding: 16px !important;\s*gap: 12px !important;\s*height: auto !important;\s*\}\s*\.search-box \{ width: 100% !important; \}\s*\.search-box input \{ width: 100% !important; \}\s*\.grid-viewport \{ padding: 16px !important; \}\s*\.notes-grid \{ grid-template-columns: 1fr !important; gap: 16px !important; \}\s*\.session-card \{ flex-direction: column; align-items: flex-start; \}\s*\.detail-top \{ padding: 16px !important; \}\s*\.detail-info \{ font-size: 18px !important; \}\s*\}"""
hist = re.sub(leaked_css, "", hist)
hist = hist.replace("padding: 16px 56px 16px 56px !important;", "padding: 6px 40px 6px 40px !important; gap: 6px !important;")

hyper_history_css = """
        @media (max-width: 768px) {
            .notes-toolbar {
                flex-direction: column !important;
                align-items: stretch !important;
                padding: 6px 40px !important;
                gap: 6px !important;
                height: auto !important;
            }
            .search-box { width: 100% !important; height: 32px !important; }
            .search-box input { width: 100% !important; font-size: 12px !important; }
            .grid-viewport { padding: 8px !important; }
            .notes-grid { grid-template-columns: 1fr !important; gap: 8px !important; }
            .session-card { flex-direction: column; align-items: flex-start; padding: 10px !important; }
            .detail-top { padding: 8px !important; }
            .detail-info { font-size: 14px !important; }
            .session-profile { font-size: 14px !important; }
            .session-date { font-size: 11px !important; }
            .message-body { font-size: 12px !important; padding: 8px 12px !important; }
        }
"""
hist = re.sub(r'(\s*)(`\s*;\s*\}\s*render\(\)\s*\{)', r'\1' + hyper_history_css + r'\2', hist) # inject at end of static get styles

with open('src/components/views/HistoryView.js', 'w', encoding='utf-8') as f:
    f.write(hist)


# ==============================================================================
# 5. NOTES VIEW
# ==============================================================================
with open('src/components/views/NotesView.js', 'r', encoding='utf-8') as f:
    notes = f.read()

# Remove old big css
old_notes_css = r"""\s*@media \(max-width: 768px\) \{\s*\.toolbar \{\s*flex-direction: column !important;\s*align-items: stretch !important;\s*padding: 16px 56px 16px 56px !important;\s*gap: 12px !important;\s*height: auto !important;\s*\}\s*\.toolbar > div:first-child \{\s*display: none !important;\s*\}\s*\.toolbar \.search-container, \.toolbar \.search-container input \{\s*width: 100% !important;\s*max-width: 100% !important;\s*\}\s*\.grid-viewport \{ padding: 16px !important; \}\s*\.notes-grid \{ grid-template-columns: 1fr !important; gap: 16px !important; \}\s*\.note-card \{ height: auto !important; min-height: 120px !important; \}\s*\.list-row \{ padding: 16px !important; gap: 12px !important; flex-wrap: wrap; \}\s*\.list-row-title \{ font-size: 16px !important; \}\s*\}"""
notes = re.sub(old_notes_css, "", notes)

hyper_notes_css = """
        @media (max-width: 768px) {
            .toolbar {
                flex-direction: column !important;
                align-items: stretch !important;
                padding: 6px 40px !important;
                gap: 6px !important;
                height: auto !important;
            }
            .toolbar > div:first-child { display: none !important; }
            .toolbar .search-container { width: 100% !important; max-width: 100% !important; height: 32px !important; }
            .toolbar .search-container input { font-size: 12px !important; padding: 4px 8px 4px 30px !important; height: 100% !important;}
            .toolbar button { height: 32px !important; font-size: 12px !important; padding: 0 10px !important; border-radius: 6px !important;}
            .grid-viewport { padding: 8px !important; }
            .notes-grid { grid-template-columns: 1fr !important; gap: 8px !important; }
            .note-card { height: auto !important; min-height: 70px !important; padding: 10px !important; }
            .list-row { padding: 8px !important; gap: 6px !important; flex-wrap: wrap; }
            .list-row-title { font-size: 13px !important; }
            .note-content-preview { font-size: 11px !important; }
        }
"""
notes = notes.replace("</style>", hyper_notes_css + "\n</style>")

with open('src/components/views/NotesView.js', 'w', encoding='utf-8') as f:
    f.write(notes)


# ==============================================================================
# 6. BROWSE VIEW
# ==============================================================================
with open('src/components/views/BrowseView.js', 'r', encoding='utf-8') as f:
    browse = f.read()

browse = browse.replace("padding: 12px 56px 12px 56px !important;", "padding: 6px 40px 6px 40px !important; gap: 6px !important;")
hyper_browse = """
        @media (max-width: 768px) {
            .address-input { height: 32px !important; font-size: 12px !important; padding: 4px 8px !important; border-radius: 6px !important;}
            .nav-btn { width: 32px !important; height: 32px !important; }
            .nav-btn svg { width: 16px !important; height: 16px !important; }
        }
"""
if ".address-input { height: 32px" not in browse:
    browse = browse.replace("        `\n    ];", hyper_browse + "\n        `\n    ];")

with open('src/components/views/BrowseView.js', 'w', encoding='utf-8') as f:
    f.write(browse)

print("Hyper-compact stealth mobile layout applied!")
