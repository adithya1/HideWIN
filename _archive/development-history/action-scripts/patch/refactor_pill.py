import re

with open('src/components/views/MainView.js', 'r', encoding='utf-8') as f:
    code = f.read()

# Replace inline styles with classes for the dropdown wrappers
old_mode_wrapper = """<div style="width: 220px; flex-shrink: 0; flex-grow: 0; display: flex; flex-direction: column; position: relative;" @click=${(e) => { e.stopPropagation(); this.isModeMenuOpen = !this.isModeMenuOpen; this.isProfileMenuOpen = false; this.requestUpdate(); }}>"""
new_mode_wrapper = """<div class="pill-dropdown-wrapper" @click=${(e) => { e.stopPropagation(); this.isModeMenuOpen = !this.isModeMenuOpen; this.isProfileMenuOpen = false; this.requestUpdate(); }}>"""

old_mode_inner = """<div style="display: flex; align-items: center; gap: 12px; padding: 6px 0; cursor: pointer; width: 100%;">"""
new_mode_inner = """<div class="pill-dropdown-inner">"""

old_profile_wrapper = """<div style="width: 220px; flex-shrink: 0; flex-grow: 0; display: flex; flex-direction: column; position: relative;" @click=${(e) => {"""
new_profile_wrapper = """<div class="pill-dropdown-wrapper" @click=${(e) => {"""

old_profile_inner = """<div style="display: flex; align-items: center; gap: 12px; padding: 6px 0; cursor: pointer; width: 100%; opacity: ${this._selectedModeCategory ? '1' : '0.5'};">"""
new_profile_inner = """<div class="pill-dropdown-inner" style="opacity: ${this._selectedModeCategory ? '1' : '0.5'};">"""

code = code.replace(old_mode_wrapper, new_mode_wrapper)
code = code.replace(old_mode_inner, new_mode_inner)
code = code.replace(old_profile_wrapper, new_profile_wrapper)
code = code.replace(old_profile_inner, new_profile_inner)

# Also for the Mouse Toggle wrapper
old_mouse_wrapper = """<div class="mouse-toggle-container" style="flex: 1; display: flex; align-items: center; justify-content: center; gap: 12px;">"""
new_mouse_wrapper = """<div class="mouse-toggle-container">"""

code = code.replace(old_mouse_wrapper, new_mouse_wrapper)

# Add CSS for desktop
desktop_css = """
        .pill-dropdown-wrapper {
            width: 220px;
            flex-shrink: 0;
            flex-grow: 0;
            display: flex;
            flex-direction: column;
            position: relative;
        }
        .pill-dropdown-inner {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 6px 0;
            cursor: pointer;
            width: 100%;
        }
        .mouse-toggle-container {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 12px;
        }
        .mobile-field-label { display: none; }
        .mobile-field-chevron { display: none; }
"""

code = code.replace("/* --- Component Styles --- */", "/* --- Component Styles --- */\n" + desktop_css)

# Update Mobile CSS
mobile_css_to_find = """.action-bar-pill > div, .action-bar-pill > button {
                width: 100% !important;
                max-width: 100% !important;
            }"""

mobile_css_new = """.action-bar-pill > div, .action-bar-pill > button {
                width: 100% !important;
                max-width: 100% !important;
            }
            .action-bar-divider {
                display: none !important;
            }
            .pill-dropdown-wrapper {
                width: 100% !important;
                border-bottom: 1px solid var(--border);
                padding-bottom: 16px;
            }
            .pill-dropdown-inner {
                justify-content: space-between;
                padding: 0 !important;
            }
            .pill-dropdown-inner > svg:first-child {
                display: none; /* Hide the search/avatar icons on mobile for cleaner look */
            }
            .mobile-field-label {
                display: block;
                font-size: 15px;
                color: var(--text-secondary);
                font-weight: 500;
            }
            .mobile-field-chevron {
                display: block;
                color: var(--text-muted);
            }
            .mouse-toggle-container {
                justify-content: space-between !important;
                border-bottom: 1px solid var(--border);
                padding-bottom: 16px;
                margin-bottom: 8px;
            }
            .action-bar-pill {
                padding: 24px 20px 20px 20px !important;
                gap: 16px !important;
            }
            .action-bar-btn {
                height: 52px !important;
                font-size: 16px !important;
                border-radius: 12px !important;
                margin-top: 8px;
            }"""

code = code.replace(mobile_css_to_find, mobile_css_new)

# Add the Mobile labels and chevron to the inner wrappers
old_mode_span = """<span style="font-size: 15px; font-weight: ${this._selectedModeCategory ? '600' : '500'}; color: ${this._selectedModeCategory ? 'var(--text-primary)' : 'var(--text-muted)'}; flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">"""
new_mode_span = """<span class="mobile-field-label">Mode</span>
<span style="font-size: 15px; font-weight: ${this._selectedModeCategory ? '600' : '500'}; color: ${this._selectedModeCategory ? 'var(--text-primary)' : 'var(--text-muted)'}; flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; text-align: right; padding-right: 8px;">"""
code = code.replace(old_mode_span, new_mode_span)

old_profile_span = """<span style="font-size: 15px; font-weight: ${this.selectedProfile ? '600' : '500'}; color: ${this.selectedProfile ? 'var(--text-primary)' : 'var(--text-muted)'}; flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">"""
new_profile_span = """<span class="mobile-field-label">Profile</span>
<span style="font-size: 15px; font-weight: ${this.selectedProfile ? '600' : '500'}; color: ${this.selectedProfile ? 'var(--text-primary)' : 'var(--text-muted)'}; flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; text-align: right; padding-right: 8px;">"""
code = code.replace(old_profile_span, new_profile_span)

# Add the chevron SVG after the inner span closes (We can just insert it before the closing </div> of inner)
# Inner wrapper closes exactly after the span closes. I'll use regex.
import re
code = re.sub(r'(</span\s*>\s*)(\s*</div\s*>\s*<!-- child-dropdown -->|<!-- Child dropdown -->|<!-- Child Dropdown -->|<!-- Mouse Toggle -->)', r'\1<svg class="mobile-field-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>\n\2', code, flags=re.IGNORECASE)

# Wait, finding the closing div of pill-dropdown-inner might be tricky. Let's just do a specific string replace:
old_mode_inner_close = """                             </span>
                        </div>

                        ${this.isModeMenuOpen ? html`"""
new_mode_inner_close = """                             </span>
                             <svg class="mobile-field-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
                        </div>

                        ${this.isModeMenuOpen ? html`"""
code = code.replace(old_mode_inner_close, new_mode_inner_close)

old_profile_inner_close = """                             </span>
                        </div>
                        
                        ${this.isProfileMenuOpen ? html`"""
new_profile_inner_close = """                             </span>
                             <svg class="mobile-field-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
                        </div>
                        
                        ${this.isProfileMenuOpen ? html`"""
code = code.replace(old_profile_inner_close, new_profile_inner_close)

with open('src/components/views/MainView.js', 'w', encoding='utf-8') as f:
    f.write(code)

print("Refactored Action Pill HTML & CSS.")
