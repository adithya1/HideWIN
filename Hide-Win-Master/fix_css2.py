import re

with open('src/components/views/MainView.js', 'r', encoding='utf-8') as f:
    code = f.read()

bad_css = '''
        .action-bar-pill {
            display: flex;
            align-items: center;
            border-radius: 50px;
            background: var(--bg-surface);
            padding: 8px 12px 8px 24px;
            width: 100%;
            max-width: 850px;
            transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
        }
        
        .action-bar-divider {
            width: 1px; height: 32px; background: var(--border); margin: 0 12px;
        }

        .action-bar-btn {
            height: 44px; padding: 0 32px; border-radius: 22px; font-size: 15px;
        }

        @media (max-width: 768px) {
            .action-bar-pill {
                flex-direction: column;
                border-radius: 16px;
                padding: 16px;
                gap: 16px;
                max-width: 100%;
            }
            .action-bar-pill > div, .action-bar-pill > button {
                width: 100% !important;
                max-width: 100% !important;
            }
            .action-bar-divider {
                width: 100%;
                height: 1px;
                margin: 8px 0;
            }
            .action-bar-btn {
                width: 100%;
            }
            .mouse-toggle-container {
                flex-direction: row !important;
                justify-content: space-between !important;
                width: 100% !important;
                max-width: 100% !important;
            }
        }
'''

styles_end = code.find('    `\n\n    static properties = {')
if styles_end == -1:
    styles_end = code.find('    `;\n\n    static properties')
    if styles_end == -1:
        # just find static properties
        prop_idx = code.find('static properties')
        styles_end = code.rfind('`', 0, prop_idx)

print("Found styles end at:", styles_end)

code = code[:styles_end] + bad_css + '\n    ' + code[styles_end:]

with open('src/components/views/MainView.js', 'w', encoding='utf-8') as f:
    f.write(code)

print("Restored CSS!")
