import re

with open('src/components/views/MainView.js', 'r', encoding='utf-8') as f:
    code = f.read()

# Add mobile styling for action-bar-pill
css_to_add = """
            /* Transform pill into stacked login-style inputs on mobile */
            .action-bar-pill {
                flex-direction: column !important;
                background: transparent !important;
                border: none !important;
                box-shadow: none !important;
                padding: 0 16px !important;
                gap: 16px !important;
            }
            .action-bar-divider {
                display: none !important;
            }
            .pill-dropdown-wrapper {
                width: 100% !important;
                min-width: unset !important;
            }
            .pill-dropdown-inner {
                background: var(--bg-surface) !important;
                border: 1px solid var(--border) !important;
                border-radius: 12px !important;
                padding: 16px 20px !important;
                width: 100% !important;
                box-sizing: border-box;
                height: 56px !important;
            }
            .action-bar-btn {
                width: 100% !important;
                height: 52px !important;
                border-radius: 12px !important;
                margin-top: 8px !important;
                font-size: 16px !important;
                font-weight: 600 !important;
            }"""

if '/* Transform pill into stacked' not in code:
    code = code.replace(
        '@media (max-width: 768px) {',
        '@media (max-width: 768px) {\n' + css_to_add
    )
    with open('src/components/views/MainView.js', 'w', encoding='utf-8') as f:
        f.write(code)
    print("Patched MainView mobile styling successfully.")
else:
    print("MainView mobile styling already applied.")
