import re

fpath = 'src/components/views/MainView.js'
with open(fpath, 'r', encoding='utf-8') as f:
    content = f.read()

# Add danger and active states back to primary-action-btn
danger_css = '''
        .primary-action-btn.danger { background: var(--danger, #ef4444); }
        .primary-action-btn.danger:hover { background: #dc2626; }
        .primary-action-btn.active {
            background: rgba(59, 130, 246, 0.1);
            border: 1px solid var(--accent);
            color: var(--accent);
            box-shadow: none;
        }
'''

content = content.replace(
    '.primary-action-btn svg { width: 16px; height: 16px; }',
    '.primary-action-btn svg { width: 16px; height: 16px; }\n' + danger_css
)

with open(fpath, 'w', encoding='utf-8') as f:
    f.write(content)
