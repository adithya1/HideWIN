import re

with open('src/components/views/MainView.js', 'r', encoding='utf-8') as f:
    code = f.read()

old_profile_inner = """<div style="display: flex; align-items: center; justify-content: space-between; padding: 6px 0; cursor: pointer; width: 100%; gap: 8px;">"""
new_profile_inner = """<div class="pill-dropdown-inner" style="display: flex; align-items: center; justify-content: space-between; padding: 6px 0; cursor: pointer; width: 100%; gap: 8px;">"""

if old_profile_inner in code:
    code = code.replace(old_profile_inner, new_profile_inner)
    print("Added pill-dropdown-inner class to profile dropdown.")
else:
    print("Could not find profile inner div.")
    
with open('src/components/views/MainView.js', 'w', encoding='utf-8') as f:
    f.write(code)
