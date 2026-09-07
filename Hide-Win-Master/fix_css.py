import re

with open('src/components/views/MainView.js', 'r', encoding='utf-8') as f:
    code = f.read()

# The CSS string that was wrongly placed inside _renderStatusIndicator
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

if bad_css in code:
    code = code.replace(bad_css, '')
    print("Removed bad css from _renderStatusIndicator")
else:
    print("Could not find exact string for bad css. Will use regex.")
    
    match = re.search(r'\.action-bar-pill \{.*?\}\s*\}\s*\\n    </style>', code, re.DOTALL)
    if match:
        print("Found with regex!")
        # We'll just remove everything from .action-bar-pill down to the last closing brace before \n </style>
        # Let's just do it carefully.
        
# Actually, let's just use string replacement for the exact substring!
# We can just extract it since we know exactly where it is!
start_idx = code.find('.action-bar-pill {')
end_idx = code.find('</style>', start_idx)

extracted_css = code[start_idx:end_idx].strip()
print("Extracted CSS length:", len(extracted_css))

code = code[:start_idx] + code[end_idx:]

# Now insert extracted_css into static styles = css`
# Find the end of static styles
styles_end = code.find('    `\n\n    static properties = {')
if styles_end == -1:
    # Try another way to find the end of static styles
    styles_end = code.find('    `;', code.find('static styles = css`'))
    if styles_end == -1:
        styles_end = code.find('    `', code.find('static styles = css`'))

print("Found styles end at:", styles_end)

code = code[:styles_end] + extracted_css + '\n' + code[styles_end:]

with open('src/components/views/MainView.js', 'w', encoding='utf-8') as f:
    f.write(code)

print("Done!")
