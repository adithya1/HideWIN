import re
with open('src/components/views/MainView.js', 'r', encoding='utf-8') as f:
    main_view = f.read()

pattern = r'<div style="display: flex; align-items: center; border: 1px solid \$\{borderColor === \'var\(--accent, #3b82f6\)\' \? \'var\(--border\)\' : borderColor\}; box-shadow: 0 12px 40px rgba\(0,0,0,0\.15\), 0 0 0 4px \$\{outlineColor\}; border-radius: 50px; background: var\(--bg-surface\); padding: 8px 12px 8px 24px; width: 100%; max-width: 850px; transition: all 0\.3s cubic-bezier\(0\.25, 0\.8, 0\.25, 1\);">'
replacement = '<div class="action-bar-pill" style="border: 1px solid ; box-shadow: 0 12px 40px rgba(0,0,0,0.15), 0 0 0 4px ;">'

main_view = re.sub(pattern, replacement, main_view)

with open('src/components/views/MainView.js', 'w', encoding='utf-8') as f:
    f.write(main_view)
