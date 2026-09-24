file_path = r"c:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\app\HideWinApp.js"
with open(file_path, 'r', encoding='utf-8') as f:
    code = f.read()

import re

# We want to find the return html` near the end of render()
# and inject the absolute wrapper for live-bar, and REMOVE the .is-session logic that wraps it
# Currently it looks like:
#        return html`
#            <div class="app-shell" style="${isSessionWindow && this.isSessionHidden ? 'display: none;' : ''}">
#                ${isSessionWindow ? renderLiveBar(this) : html`

target = r'(return\s*html`\s*)<div class="app-shell" style="\$\{isSessionWindow && this\.isSessionHidden \? \'display: none;\' : \'\'\}">\s*\$\{isSessionWindow \? renderLiveBar\(this\) : html`\s*(.*?)\s*`\}'

# Replace with:
replacement = r"""\1<div style="position: absolute; top: 0; left: 0; width: 100%; display: flex; justify-content: center; z-index: 99999; pointer-events: none;">
                <div style="pointer-events: auto; display: flex; -webkit-app-region: drag;">
                ${this.sessionActive && !this.isPaused ? renderLiveBar(this) : ''}
                </div>
            </div>
            <div class="app-shell" style="${this.sessionActive && !this.isPaused && this.isSessionHidden ? 'display: none;' : ''}">
                \2
"""

code = re.sub(target, replacement, code, flags=re.DOTALL)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(code)

print("SUCCESS")
