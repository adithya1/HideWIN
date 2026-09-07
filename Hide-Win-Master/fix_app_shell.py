import re
with open(r'c:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\app\HideWinApp.js', 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Update the HTML
# The main authenticated view is on Line 2210.
# Look for: <div class="app-shell" style="${this.isSessionHidden ? 'display: none;' : (isLive ? 'margin-top: 48px; height: calc(100vh - 78px);' : '')}">
old_html = r'<div class="app-shell" style="\$\{\s*this\.isSessionHidden \? \'display: none;\' : \(isLive \? \'margin-top: 48px; height: calc\(100vh - 78px\);\' : \'\'\)\s*\}">'
new_html = r'<div class="app-shell app-shell-main" style="${this.isSessionHidden ? \'display: none;\' : (isLive ? \'margin-top: 48px; height: calc(100vh - 78px);\' : \'\')}">'

text = re.sub(old_html, new_html, text)

# 2. Update the CSS
# We change `.app-shell { display: grid !important; ... }` to `.app-shell-main { display: grid !important; ... }`
# And for the mobile view: `.app-shell-main { display: flex !important; flex-direction: column !important; }`
text = text.replace('.app-shell {\n                display: grid !important;', '.app-shell-main {\n                display: grid !important;')
text = text.replace('.app-shell:has(.top-toolbar:hover) {', '.app-shell-main:has(.top-toolbar:hover) {')
text = text.replace('.app-shell {\n                display: flex !important;', '.app-shell-main {\n                display: flex !important;')

with open(r'c:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\app\HideWinApp.js', 'w', encoding='utf-8') as f:
    f.write(text)

print("Fixed app-shell grid issue for non-main views!")
