import re

fpath = 'src/components/views/MainView.js'
with open(fpath, 'r', encoding='utf-8') as f:
    content = f.read()

# Fix :host
host_css = '''
        :host {
            min-height: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: flex-start;
            padding: var(--space-md);
            overflow-y: auto;
            overflow-x: hidden;
        }
'''
content = re.sub(r':host\s*\{[^}]*\}', host_css.strip(), content)

# Remove huge inline margins from the action-bar-wrapper container
content = content.replace('margin: 24px 0 40px 0;', 'margin: 16px 0;')

# In responsive, make things wrap if they absolutely have to, but prefer flex-shrink
responsive_css_add = '''
            :host { padding: 8px !important; }
            .action-bar-wrapper {
                flex-wrap: wrap !important;
                justify-content: center;
            }
            .action-dropdown { min-width: 80px !important; }
            .divider { margin: 0 4px !important; }
            .pinned-shortcuts-container { padding: 12px !important; gap: 8px !important; }
            .pinned-shortcut-card { width: 80px !important; height: 80px !important; }
'''
content = content.replace('gap: 6px !important;', 'gap: 6px !important;' + responsive_css_add)

# Change the @media to apply on small heights as well
content = content.replace('@media (max-width: 750px)', '@media (max-width: 750px), (max-height: 600px)')

with open(fpath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated MainView.js to prevent off-screen clipping and improve dense UI.")
