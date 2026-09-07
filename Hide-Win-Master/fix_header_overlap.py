import re

# 1. Update HideWinApp.js
with open('src/components/app/HideWinApp.js', 'r', encoding='utf-8') as f:
    app_code = f.read()

# We need to replace the .mobile-app-header CSS inside the @media (max-width: 768px) block.
# It currently has:
# .mobile-app-header { display: flex; align-items: center; justify-content: space-between; width: 100%; height: 60px; background: rgba(255, 255, 255, 0.7); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); padding: 0 16px; border-bottom: 1px solid rgba(0, 0, 0, 0.05); z-index: 100; flex-shrink: 0; }
app_code = re.sub(
    r'\.mobile-app-header\s*\{[^}]*height:\s*60px;[^}]*\}',
    r'''.mobile-app-header {
                position: absolute;
                top: 36px; /* Directly below live-bar */
                left: 0;
                width: 100%;
                height: 60px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 0 16px;
                background: transparent !important;
                border-bottom: none !important;
                backdrop-filter: none !important;
                -webkit-backdrop-filter: none !important;
                z-index: 1000;
                pointer-events: none; /* Let clicks pass through center */
            }''',
    app_code
)

# And dark mode background rule
app_code = re.sub(
    r":host-context\(html\[data-theme='dark'\]\) \.mobile-app-header,\s*html\[data-theme='dark'\] \.mobile-app-header\s*\{[^}]*\}",
    "",
    app_code
)

# Hide the title, enable pointer events on buttons
app_css_additions = """
            .mobile-header-title { display: none !important; }
            .mobile-header-btn { pointer-events: auto !important; background: var(--bg-app) !important; border: 1px solid var(--border) !important; box-shadow: 0 2px 8px rgba(0,0,0,0.05) !important; }
"""
if ".mobile-header-title { display: none !important; }" not in app_code:
    app_code = app_code.replace(".mobile-header-btn {", app_css_additions + "\n            .mobile-header-btn {")

with open('src/components/app/HideWinApp.js', 'w', encoding='utf-8') as f:
    f.write(app_code)


# 2. Update MainView.js
with open('src/components/views/MainView.js', 'r', encoding='utf-8') as f:
    main = f.read()

main = main.replace(".home-container { padding: 16px !important; }", ".home-container { padding: 76px 16px 16px 16px !important; }")
with open('src/components/views/MainView.js', 'w', encoding='utf-8') as f:
    f.write(main)


# 3. Update AICustomizeView.js
with open('src/components/views/AICustomizeView.js', 'r', encoding='utf-8') as f:
    aic = f.read()

aic = aic.replace("padding: 16px !important;", "padding: 16px 56px 16px 56px !important;", 1)
with open('src/components/views/AICustomizeView.js', 'w', encoding='utf-8') as f:
    f.write(aic)


# 4. Update NotesView.js
with open('src/components/views/NotesView.js', 'r', encoding='utf-8') as f:
    notes = f.read()

notes = notes.replace("padding: 16px !important;", "padding: 16px 56px 16px 56px !important;", 1)
with open('src/components/views/NotesView.js', 'w', encoding='utf-8') as f:
    f.write(notes)


# 5. Update HistoryView.js
with open('src/components/views/HistoryView.js', 'r', encoding='utf-8') as f:
    hist = f.read()

hist = hist.replace("padding: 16px !important;", "padding: 16px 56px 16px 56px !important;", 1)
with open('src/components/views/HistoryView.js', 'w', encoding='utf-8') as f:
    f.write(hist)


# 6. Update BrowseView.js
with open('src/components/views/BrowseView.js', 'r', encoding='utf-8') as f:
    browse = f.read()

browse = browse.replace("padding: 12px 16px !important;", "padding: 12px 56px 12px 56px !important;")
with open('src/components/views/BrowseView.js', 'w', encoding='utf-8') as f:
    f.write(browse)


print("Header overlap optimization applied!")
