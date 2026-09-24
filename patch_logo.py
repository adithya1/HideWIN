import re
with open('Hide-Win-Master/src/components/app/HideWinApp.js', 'r', encoding='utf-8') as f:
    text = f.read()

old_logo = '''                    <div style="display:flex;align-items:center;min-width:0;flex:1;pointer-events:none;">
                        ${logoUrl ? html`<img src=${logoUrl} alt="HideWin" style="display:block;max-width:120px;width:auto;height:36px;object-fit:contain;object-position:left center;" />` : ''}
                    </div>'''

new_logo = '''                    <div style="display:flex;align-items:center;min-width:0;flex:1;pointer-events:none;">
                        ${logoUrl ? html`<img src=${logoUrl} alt="HideWin" style="display:block;max-width:120px;width:auto;height:36px;object-fit:contain;object-position:left center;" />` : html`<span style="font-size:17px;font-weight:700;letter-spacing:-0.3px;margin-left:4px;user-select:none;">HideWin</span>`}
                    </div>'''

text = text.replace(old_logo, new_logo)

with open('Hide-Win-Master/src/components/app/HideWinApp.js', 'w', encoding='utf-8') as f:
    f.write(text)
