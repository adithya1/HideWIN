import re

fpath = 'src/components/views/MainView.js'
with open(fpath, 'r', encoding='utf-8') as f:
    content = f.read()

# Fine-tune the responsive CSS for the action bar
responsive_css = '''
            .action-bar-wrapper {
                flex-wrap: wrap !important;
                justify-content: center;
                padding: 6px 8px !important;
                gap: 8px !important;
            }
            .action-dropdown { flex: 1 1 auto !important; min-width: 0 !important; }
            .action-dropdown-content { padding: 4px 0 !important; gap: 4px !important; }
            .action-dropdown-content svg { width: 14px; height: 14px; }
            .action-dropdown-content span { font-size: 13px !important; }
            .mouse-toggle-wrapper { transform: scale(0.85); transform-origin: right center; margin-left: auto !important; }
            .divider { display: none !important; }
'''

content = content.replace('.action-bar-wrapper {\n                flex-direction: row !important;\n                padding: 6px 8px !important;\n                gap: 6px !important;\n                border-radius: 6px !important;\n            }', responsive_css)

with open(fpath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Fine-tuned dense action bar wrapping")
