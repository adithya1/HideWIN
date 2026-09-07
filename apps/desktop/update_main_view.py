import re
with open(r'c:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\MainView.js', 'r', encoding='utf-8') as f:
    text = f.read()

# Add CSS to MainView.js
responsive_css = """
        /* MainView Responsive Action Bar */
        .action-bar-container {
            display: flex;
            align-items: center;
            border: 1px solid;
            border-radius: 50px;
            background: var(--bg-surface);
            padding: 8px 12px 8px 24px;
            width: 100%;
            max-width: 100%;
            transition: background 0.12s ease, border-color 0.12s ease, box-shadow 0.12s ease;
        }
        
        .action-dropdown {
            width: 220px;
            flex-shrink: 1;
            flex-grow: 1;
            display: flex;
            flex-direction: column;
            position: relative;
        }

        .action-divider {
            width: 1px;
            height: 32px;
            background: var(--border);
            margin: 0 20px;
        }

        @media (max-width: 768px) {
            .action-bar-container {
                flex-direction: column;
                border-radius: 20px;
                padding: 16px;
                gap: 16px;
                align-items: stretch;
            }
            .action-dropdown {
                width: 100%;
            }
            .action-divider {
                width: 100%;
                height: 1px;
                margin: 0;
            }
            .start-btn-container {
                display: flex;
                flex-direction: column;
                align-items: stretch;
                width: 100%;
                margin-top: 8px;
            }
            .start-btn-container > div, .start-btn-container > button {
                width: 100%;
                justify-content: center;
                margin-left: 0 !important;
            }
        }
"""
text = text.replace('</style>', responsive_css + '\n    </style>')

# Now replace the inline styles in _renderActionBar()
old_container = r'<div style="display: flex; align-items: center; border: 1px solid \$\{borderColor === \'var\(--accent, #3b82f6\)\' \? \'var\(--border\)\' : borderColor\}; box-shadow: 0 12px 40px rgba\(0,0,0,0\.15\), 0 0 0 4px \$\{outlineColor\}; border-radius: 50px; background: var\(--bg-surface\); padding: 8px 12px 8px 24px; width: 100%; max-width: 100%; transition: background 0\.12s ease, border-color 0\.12s ease, box-shadow 0\.12s ease;">'
new_container = r'<div class="action-bar-container" style="border-color: ${borderColor === \'var(--accent, #3b82f6)\' ? \'var(--border)\' : borderColor}; box-shadow: 0 12px 40px rgba(0,0,0,0.15), 0 0 0 4px ${outlineColor};">'
text = re.sub(old_container, new_container, text)

old_dropdown1 = r'<div style="width: 220px; flex-shrink: 0; flex-grow: 0; display: flex; flex-direction: column; position: relative;" @click=\$\{\(e\) => \{ e\.stopPropagation\(\); this\.isModeMenuOpen = !this\.isModeMenuOpen;'
new_dropdown1 = r'<div class="action-dropdown" @click=${(e) => { e.stopPropagation(); this.isModeMenuOpen = !this.isModeMenuOpen;'
text = re.sub(old_dropdown1, new_dropdown1, text)

old_divider = r'<div style="width: 1px; height: 32px; background: var\(--border\); margin: 0 20px;"></div>'
new_divider = r'<div class="action-divider"></div>'
text = re.sub(old_divider, new_divider, text)

old_dropdown2 = r'<div style="width: 220px; flex-shrink: 0; flex-grow: 0; display: flex; flex-direction: column; position: relative;" @click=\$\{\(e\) => \{ \n\s*e\.stopPropagation\(\);\n\s*if \(!this\._selectedModeCategory\) \{'
new_dropdown2 = r'<div class="action-dropdown" @click=${(e) => { \n                        e.stopPropagation(); \n                        if (!this._selectedModeCategory) {'
text = re.sub(old_dropdown2, new_dropdown2, text)

# For the start button container, let's find what comes after the profile dropdown.
# I will just write a python script to wrap the right side.
with open(r'c:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\MainView.js', 'w', encoding='utf-8') as f:
    f.write(text)
print("Updated MainView container and dropdowns!")
