import re

with open('src/components/views/MainView.js', 'r', encoding='utf-8') as f:
    code = f.read()

old_prof_span = """<span style="font-size: 15px; font-weight: ${isProfileValid ? '600' : '500'}; color: ${isProfileValid ? 'var(--text-primary)' : 'var(--text-muted)'}; flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                                ${displayProfileName}
                            </span>"""

new_prof_span = """<span class="mobile-field-label">Profile</span>
                            <span style="font-size: 15px; font-weight: ${isProfileValid ? '600' : '500'}; color: ${isProfileValid ? 'var(--text-primary)' : 'var(--text-muted)'}; flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; text-align: right; padding-right: 8px;">
                                ${displayProfileName}
                            </span>"""
                            
if old_prof_span in code:
    code = code.replace(old_prof_span, new_prof_span)
    print("Injected profile label successfully.")
else:
    print("Could not find the profile span to inject.")
    
with open('src/components/views/MainView.js', 'w', encoding='utf-8') as f:
    f.write(code)
