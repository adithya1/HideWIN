import re

with open('src/components/views/MainView.js', 'r', encoding='utf-8') as f:
    code = f.read()

# First, let's fix the desktop .action-bar-pill directly using regex
code = re.sub(
    r'\.action-bar-pill\s*\{\s*display:\s*flex;\s*align-items:\s*center;\s*border-radius:\s*50px;\s*background:\s*var\(--bg-surface\);\s*padding:\s*8px\s+12px\s+8px\s+24px;\s*width:\s*100%;\s*max-width:\s*\d+px;\s*transition:.*?;?\s*\}',
    r'''.action-bar-pill {
            display: flex;
            align-items: center;
            border-radius: 50px;
            background: var(--bg-surface);
            padding: 8px 12px 8px 24px;
            width: 100%;
            max-width: 1100px;
            transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
        }''',
    code,
    flags=re.DOTALL
)

# Fix .pill-dropdown-wrapper for desktop
code = re.sub(
    r'\.pill-dropdown-wrapper\s*\{\s*width:\s*220px;\s*flex-shrink:\s*0;\s*flex-grow:\s*0;\s*display:\s*flex;\s*flex-direction:\s*column;\s*position:\s*relative;\s*\}',
    r'''.pill-dropdown-wrapper {
            flex: 1;
            min-width: 180px;
            display: flex;
            flex-direction: column;
            position: relative;
        }''',
    code,
    flags=re.DOTALL
)

# Now, we find ALL @media (max-width: 768px) blocks and remove them!
code = re.sub(r'@media\s*\(\s*max-width:\s*768px\s*\)\s*\{.*?\n        \}(?=\s*\n)', '', code, flags=re.DOTALL)
# And 400px blocks
code = re.sub(r'@media\s*\(\s*max-width:\s*400px\s*\)\s*\{.*?\n        \}(?=\s*\n)', '', code, flags=re.DOTALL)

# And now append ONE MASTER mobile CSS block for MainView.js before the end of the css literal
master_mobile_css = """
        @media (max-width: 768px) {
            .action-bar-pill {
                flex-direction: column !important;
                border-radius: 16px !important;
                padding: 24px 20px 20px 20px !important;
                gap: 16px !important;
                margin: 24px 16px !important;
                width: auto !important;
                max-width: none !important;
                background: var(--bg-surface) !important;
                box-shadow: 0 4px 20px rgba(0,0,0,0.08) !important;
                border: 1px solid var(--border) !important;
            }
            .action-bar-pill > div, .action-bar-pill > button {
                width: 100% !important;
                max-width: 100% !important;
            }
            .action-bar-divider { display: none !important; }
            .pill-dropdown-wrapper {
                width: 100% !important;
                border-bottom: 1px solid var(--border);
                padding-bottom: 16px;
            }
            .pill-dropdown-inner {
                display: flex !important;
                flex-direction: row !important;
                align-items: center !important;
            }
            .pill-dropdown-inner .mobile-field-label {
                display: block !important;
                font-size: 16px !important;
                font-weight: 500 !important;
                color: var(--text-primary) !important;
                flex: 1;
            }
            .action-bar-btn {
                height: 52px !important;
                font-size: 16px !important;
                border-radius: 12px !important;
                margin-top: 8px;
            }
            .child-dropdown {
                position: fixed !important;
                top: auto !important;
                bottom: 0 !important;
                left: 0 !important;
                width: 100vw !important;
                max-height: 80vh !important;
                border-radius: 20px 20px 0 0 !important;
                z-index: 1000 !important;
                padding-bottom: env(safe-area-inset-bottom, 20px) !important;
                border: none !important;
                border-top: 1px solid var(--border) !important;
                box-shadow: 0 -4px 24px rgba(0,0,0,0.2) !important;
                animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards !important;
            }
            .desktop-value-span {
                text-align: right !important;
            }
            .home-container { padding: 16px !important; }
        }

        @media (max-width: 400px) {
            .mobile-field-label { display: none !important; }
            .pill-dropdown-inner { justify-content: center !important; }
            .desktop-value-span { text-align: center !important; padding-right: 0 !important; }
            .action-bar-btn { font-size: 0 !important; }
            .action-bar-btn::before { content: '?'; font-size: 16px; }
            .home-subtext { font-size: 14px !important; margin-bottom: 16px !important; }
        }
"""
code = code.replace("/* --- Component Styles --- */", "/* --- Component Styles --- */\n" + master_mobile_css)

# Fix HTML layout (removing redundant Mode/Profile labels for desktop)
code = re.sub(
    r'<span class="mobile-field-label">Mode</span>\s*<span style="font-size: 16px; font-weight: \$\{this._selectedModeCategory \? \'600\' : \'500\'\}; color: \$\{this._selectedModeCategory \? \'var\(--text-primary\)\' : \'var\(--text-muted\)\'\}; flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; text-align: right; padding-right: 8px;">\s*\$\{this._selectedModeCategory \? \(MODES\.find\(m => m\.value === this._selectedModeCategory\)\?\.label \|\| this._selectedModeCategory\) : \'Select Mode\'\}\s*</span>',
    r'''<span class="mobile-field-label">Mode</span>
                                <span style="font-size: 16px; font-weight: ${this._selectedModeCategory ? '600' : '500'}; color: ${this._selectedModeCategory ? 'var(--text-primary)' : 'var(--text-muted)'}; flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; padding-right: 8px;" class="desktop-value-span">
                                    ${this._selectedModeCategory ? (MODES.find(m => m.value === this._selectedModeCategory)?.label || this._selectedModeCategory) : 'Select mode...'}
                                </span>''',
    code, flags=re.DOTALL)

code = re.sub(
    r'<span class="mobile-field-label">Profile</span>\s*<span style="font-size: 16px; font-weight: \$\{isProfileValid \? \'600\' : \'500\'\}; color: \$\{isProfileValid \? \'var\(--text-primary\)\' : \'var\(--text-muted\)\'\}; flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; text-align: right; padding-right: 8px;">\s*\$\{displayProfileName\}\s*</span>',
    r'''<span class="mobile-field-label">Profile</span>
                                <span style="font-size: 16px; font-weight: ${isProfileValid ? '600' : '500'}; color: ${isProfileValid ? 'var(--text-primary)' : 'var(--text-muted)'}; flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; padding-right: 8px;" class="desktop-value-span">
                                    ${isProfileValid ? displayProfileName : 'Select profile...'}
                                </span>''',
    code, flags=re.DOTALL)

with open('src/components/views/MainView.js', 'w', encoding='utf-8') as f:
    f.write(code)

print("Cleaned up MainView CSS and HTML")
