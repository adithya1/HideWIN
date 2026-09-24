import re

fpath = 'src/components/views/MainView.js'
with open(fpath, 'r', encoding='utf-8') as f:
    content = f.read()

# Add .danger modifier
css = '''
        .primary-action-btn.danger {
            background: var(--danger, #ef4444);
        }
        .primary-action-btn.danger:hover {
            background: #dc2626;
        }
'''
content = content.replace('.primary-action-btn.active {', css + '\n        .primary-action-btn.active {')

# Find the end button and add danger class
content = content.replace('<button class="primary-action-btn" @click=>', '<button class="primary-action-btn danger" @click=>')

with open(fpath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Added danger button modifier.")
