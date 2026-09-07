import re

with open('src/components/views/MainView.js', 'r', encoding='utf-8') as f:
    code = f.read()

mobile_css = """            .mouse-toggle-container {
                justify-content: space-between !important;
                border-bottom: 1px solid var(--border);
                padding-bottom: 16px;
                margin-bottom: 8px;
            }"""
            
new_mobile_css = """            .mouse-toggle-container {
                justify-content: space-between !important;
                border-bottom: 1px solid var(--border);
                padding-bottom: 16px;
                margin-bottom: 8px;
            }
            .mouse-toggle-container > span {
                font-size: 15px !important;
                font-weight: 500 !important;
                color: var(--text-secondary) !important;
                text-transform: none !important;
                letter-spacing: 0 !important;
                text-align: left;
                flex: 1;
            }"""

code = code.replace(mobile_css, new_mobile_css)

with open('src/components/views/MainView.js', 'w', encoding='utf-8') as f:
    f.write(code)
