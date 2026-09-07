import re

# Update HideWinApp.js
with open('src/components/app/HideWinApp.js', 'r', encoding='utf-8') as f:
    app_code = f.read()

old_header_title = """<div style="font-size: 18px; font-weight: 600; color: var(--text-primary);">
                        HideWin
                    </div>"""
new_header_title = """<div style="font-size: 22px; font-weight: 600; color: var(--text-primary);">
                        HideWin
                    </div>"""
app_code = app_code.replace(old_header_title, new_header_title)

with open('src/components/app/HideWinApp.js', 'w', encoding='utf-8') as f:
    f.write(app_code)


# Update MainView.js
with open('src/components/views/MainView.js', 'r', encoding='utf-8') as f:
    main_code = f.read()

# 1. Update field labels
old_mobile_field = """            .mobile-field-label {
                display: block;
                font-size: 15px;"""
new_mobile_field = """            .mobile-field-label {
                display: block;
                font-size: 16px;"""
main_code = main_code.replace(old_mobile_field, new_mobile_field)

# 2. Update Mouse Detect label
old_mouse_font = """            .mouse-toggle-container > span {
                font-size: 15px !important;"""
new_mouse_font = """            .mouse-toggle-container > span {
                font-size: 16px !important;"""
main_code = main_code.replace(old_mouse_font, new_mouse_font)

# 3. Update Pinned Shortcuts subtext
old_subtext = """                <div class="home-subtext" style="margin-top: 16px; font-weight: 600; color: var(--text-primary);">
                    Pinned Shortcuts
                </div>"""
new_subtext = """                <div class="home-subtext" style="margin-top: 24px; font-size: 18px !important; font-weight: 600; color: var(--text-primary);">
                    Pinned Shortcuts
                </div>"""
main_code = main_code.replace(old_subtext, new_subtext)

# 4. Update the mode/profile selected values
old_mode_span_15 = """<span style="font-size: 15px; font-weight: ${this._selectedModeCategory ? '600' : '500'}; color: ${this._selectedModeCategory ? 'var(--text-primary)' : 'var(--text-muted)'}; flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; text-align: right; padding-right: 8px;">"""
new_mode_span_16 = """<span style="font-size: 16px; font-weight: ${this._selectedModeCategory ? '600' : '500'}; color: ${this._selectedModeCategory ? 'var(--text-primary)' : 'var(--text-muted)'}; flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; text-align: right; padding-right: 8px;">"""
main_code = main_code.replace(old_mode_span_15, new_mode_span_16)

old_prof_span_15 = """<span style="font-size: 15px; font-weight: ${isProfileValid ? '600' : '500'}; color: ${isProfileValid ? 'var(--text-primary)' : 'var(--text-muted)'}; flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; text-align: right; padding-right: 8px;">"""
new_prof_span_16 = """<span style="font-size: 16px; font-weight: ${isProfileValid ? '600' : '500'}; color: ${isProfileValid ? 'var(--text-primary)' : 'var(--text-muted)'}; flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; text-align: right; padding-right: 8px;">"""
main_code = main_code.replace(old_prof_span_15, new_prof_span_16)

with open('src/components/views/MainView.js', 'w', encoding='utf-8') as f:
    f.write(main_code)

print("Updated mobile typography.")
