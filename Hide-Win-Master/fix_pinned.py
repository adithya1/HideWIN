import re

fpath = 'src/components/views/MainView.js'
with open(fpath, 'r', encoding='utf-8') as f:
    content = f.read()

pinned_css = '''
        /* Tiny Pinned Shortcuts */
        @media (max-width: 550px) {
            .pinned-shortcuts-container { 
                padding: 4px !important; 
                gap: 6px !important; 
                border: none !important;
                background: transparent !important;
                box-shadow: none !important;
            }
            .pinned-shortcut-card { 
                width: 32px !important; 
                height: 32px !important; 
                padding: 0 !important; 
                border-radius: 6px !important; 
                justify-content: center !important; 
                border: 1px solid var(--border) !important;
            }
            .pinned-shortcut-card:hover { transform: none !important; background: var(--bg-hover) !important; }
            .pinned-shortcut-card svg { margin: 0 !important; width: 14px; height: 14px; }
            .pinned-shortcut-card span, .pinned-shortcut-card .timestamp { display: none !important; }
        }
'''

content = content.replace('/* Always keep popup menus readable */', pinned_css + '\n        /* Always keep popup menus readable */')

with open(fpath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Restored pinned shortcuts mobile styles.")
