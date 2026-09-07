import re

with open('src/components/app/HideWinApp.js', 'r', encoding='utf-8') as f:
    code = f.read()

old_block = """            .top-toolbar {
                position: absolute;
                left: 0;
                top: 40px;
                height: calc(100vh - 40px) !important;
                width: 240px !important;
                flex-direction: column;
                align-items: flex-start;
                background: var(--bg-surface);
                border-bottom: none;
                border-right: 1px solid var(--border);
                padding: 16px 12px;
                transform: translateX(-100%);
                transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                box-shadow: 4px 0 24px rgba(0,0,0,0.4);
                z-index: 1000;
            }
            .top-toolbar.mobile-open {
                transform: translateX(0);
            }
            .horizontal-nav {
                flex-direction: column;
                align-items: flex-start;
                width: 100%;
                gap: 12px;
                margin-top: 16px;
            }
            .nav-item {
                width: 100%;
                justify-content: flex-start;
                padding: 10px 12px;
                border-radius: 8px;
            }"""

new_block = """            .top-toolbar {
                display: none !important;
            }"""

if old_block in code:
    code = code.replace(old_block, new_block)
    print("Fixed old mobile block.")
else:
    print("Could not find old block.")
    
with open('src/components/app/HideWinApp.js', 'w', encoding='utf-8') as f:
    f.write(code)
