import re

with open('src/components/views/MainView.js', 'r', encoding='utf-8') as f:
    code = f.read()

# Replace hardcoded vertical dividers with class
code = code.replace(
    '<div style="width: 1px; height: 32px; background: var(--border); margin: 0 20px;"></div>',
    '<div class="action-bar-divider" style="width: 1px; height: 32px; background: var(--border); margin: 0 20px;"></div>'
)
code = code.replace(
    '<div style="width: 1px; height: 32px; background: var(--border); margin: 0 12px;"></div>',
    '<div class="action-bar-divider" style="width: 1px; height: 32px; background: var(--border); margin: 0 12px;"></div>'
)

# Also fix the media query to override inline styles
css_fix = '''        @media (max-width: 768px) {
            .action-bar-divider {
                width: 100% !important;
                height: 1px !important;
                margin: 0 !important;
            }'''
code = code.replace('''        @media (max-width: 768px) {
            .action-bar-divider {
                width: 100%;
                height: 1px;
            }''', css_fix)

with open('src/components/views/MainView.js', 'w', encoding='utf-8') as f:
    f.write(code)
