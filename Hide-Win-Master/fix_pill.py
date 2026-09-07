import re

with open('src/components/views/MainView.js', 'r', encoding='utf-8') as f:
    code = f.read()

bad_string = '<div class="action-bar-pill" style="border: 1px solid ; box-shadow: 0 12px 40px rgba(0,0,0,0.15), 0 0 0 4px ;">'
good_string = '<div class="action-bar-pill" style="border: 1px solid ${borderColor === \'var(--accent, #3b82f6)\' ? \'var(--border)\' : borderColor}; box-shadow: 0 12px 40px rgba(0,0,0,0.15), 0 0 0 4px ${outlineColor};">'

code = code.replace(bad_string, good_string)

with open('src/components/views/MainView.js', 'w', encoding='utf-8') as f:
    f.write(code)
