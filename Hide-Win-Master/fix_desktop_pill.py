import re

with open('src/components/views/MainView.js', 'r', encoding='utf-8') as f:
    code = f.read()

# 1. Expand the Action Bar Pill max-width
old_pill_css = """        .action-bar-pill {
            display: flex;
            align-items: center;
            border-radius: 50px;
            background: var(--bg-surface);
            padding: 8px 12px 8px 24px;
            width: 100%;
            max-width: 850px;
            transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
        }"""
new_pill_css = """        .action-bar-pill {
            display: flex;
            align-items: center;
            border-radius: 50px;
            background: var(--bg-surface);
            padding: 8px 12px 8px 24px;
            width: 100%;
            max-width: 1100px;
            transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
        }"""
code = code.replace(old_pill_css, new_pill_css)

# 2. Make wrappers flexible
old_wrapper_css = """        .pill-dropdown-wrapper {
            width: 220px;
            flex-shrink: 0;
            flex-grow: 0;
            display: flex;
            flex-direction: column;
            position: relative;
        }"""
new_wrapper_css = """        .pill-dropdown-wrapper {
            flex: 1;
            min-width: 180px;
            display: flex;
            flex-direction: column;
            position: relative;
        }"""
code = code.replace(old_wrapper_css, new_wrapper_css)

# 3. Add stealth mode compact CSS
stealth_css = """
        /* Stealth Compact Mode */
        @media (max-width: 400px) {
            .mobile-field-label { display: none !important; }
            .pill-dropdown-inner { justify-content: center !important; }
            .pill-dropdown-inner span { text-align: center !important; padding-right: 0 !important; }
            .action-bar-btn { font-size: 0 !important; }
            .action-bar-btn::before { content: '?'; font-size: 16px; }
            .home-subtext { font-size: 16px !important; margin-bottom: 16px !important; }
        }
"""
code = code.replace("/* Pinned grid fix for mobile */", stealth_css + "/* Pinned grid fix for mobile */")

# 4. Remove redundant labels from Desktop HTML
# Mode label
old_mode_html = """<span class="mobile-field-label">Mode</span>
                             <span style="font-size: 16px; font-weight: ${this._selectedModeCategory ? '600' : '500'}; color: ${this._selectedModeCategory ? 'var(--text-primary)' : 'var(--text-muted)'}; flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; text-align: right; padding-right: 8px;">
                                 ${this._selectedModeCategory ? (MODES.find(m => m.value === this._selectedModeCategory)?.label || this._selectedModeCategory) : 'Select Mode'}
                             </span>"""
new_mode_html = """<span class="mobile-field-label">Mode</span>
                             <span style="font-size: 16px; font-weight: ${this._selectedModeCategory ? '600' : '500'}; color: ${this._selectedModeCategory ? 'var(--text-primary)' : 'var(--text-muted)'}; flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; padding-right: 8px;" class="desktop-value-span">
                                 ${this._selectedModeCategory ? (MODES.find(m => m.value === this._selectedModeCategory)?.label || this._selectedModeCategory) : 'Select mode...'}
                             </span>"""
code = code.replace(old_mode_html, new_mode_html)

# Profile label
old_prof_html = """<span class="mobile-field-label">Profile</span>
                            <span style="font-size: 16px; font-weight: ${isProfileValid ? '600' : '500'}; color: ${isProfileValid ? 'var(--text-primary)' : 'var(--text-muted)'}; flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; text-align: right; padding-right: 8px;">
                                ${displayProfileName}
                            </span>"""
new_prof_html = """<span class="mobile-field-label">Profile</span>
                            <span style="font-size: 16px; font-weight: ${isProfileValid ? '600' : '500'}; color: ${isProfileValid ? 'var(--text-primary)' : 'var(--text-muted)'}; flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; padding-right: 8px;" class="desktop-value-span">
                                ${isProfileValid ? displayProfileName : 'Select profile...'}
                            </span>"""
code = code.replace(old_prof_html, new_prof_html)

# Inject desktop-value-span right alignment for mobile
align_css = """        .desktop-value-span { text-align: left; }
        @media (max-width: 768px) { .desktop-value-span { text-align: right !important; } }
"""
code = code.replace("/* --- Component Styles --- */", "/* --- Component Styles --- */\n" + align_css)

with open('src/components/views/MainView.js', 'w', encoding='utf-8') as f:
    f.write(code)

print("Applied Phase 1 & 2 fixes.")
