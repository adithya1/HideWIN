import re

with open('src/components/views/MainView.js', 'r', encoding='utf-8') as f:
    code = f.read()

# Fix the pill-dropdown-inner on mobile
old_inner_css = """            .pill-dropdown-inner {
                justify-content: space-between;
                padding: 0 !important;
            }"""
new_inner_css = """            .pill-dropdown-inner {
                display: flex !important;
                flex-direction: row !important;
                align-items: center !important;
                justify-content: space-between !important;
                padding: 0 !important;
                width: 100% !important;
                gap: 8px !important;
            }
            .mobile-field-label {
                flex-shrink: 0;
            }"""

if old_inner_css in code:
    code = code.replace(old_inner_css, new_inner_css)
    print("Fixed inner CSS.")
else:
    print("Could not find inner CSS.")

# Ensure Profile label replacement worked
# Check if "Profile" label is there
if '<span class="mobile-field-label">Profile</span>' not in code:
    print("Profile label missing, attempting to inject.")
    old_prof = """<span style="font-size: 15px; font-weight: ${this.selectedProfile ? '600' : '500'}; color: ${this.selectedProfile ? 'var(--text-primary)' : 'var(--text-muted)'}; flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">"""
    new_prof = """<span class="mobile-field-label">Profile</span>\n<span style="font-size: 15px; font-weight: ${this.selectedProfile ? '600' : '500'}; color: ${this.selectedProfile ? 'var(--text-primary)' : 'var(--text-muted)'}; flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; text-align: right; padding-right: 8px;">"""
    if old_prof in code:
        code = code.replace(old_prof, new_prof)
        print("Injected Profile label.")
    else:
        print("Could not find Profile span to inject label.")

with open('src/components/views/MainView.js', 'w', encoding='utf-8') as f:
    f.write(code)
