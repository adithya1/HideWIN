import re

with open('src/components/views/MainView.js', 'r', encoding='utf-8') as f:
    code = f.read()

# We need to find the stray "/* Pinned grid fix for mobile */" and wrap it in @media
broken_block = """/* Pinned grid fix for mobile */
            .pinned-shortcuts-container {
                grid-template-columns: repeat(2, 1fr) !important;
                margin: 0 16px 24px 16px !important;
                width: auto !important;
                box-sizing: border-box;
                padding: 16px !important;
            }
            .pinned-shortcut-card {
                width: 100% !important;
                height: 100px !important;
            }
            .home-subtext {
                margin-left: 16px !important;
                margin-right: 16px !important;
            }
        }"""

fixed_block = """
        @media (max-width: 768px) {
            /* Pinned grid fix for mobile */
            .pinned-shortcuts-container {
                grid-template-columns: repeat(2, 1fr) !important;
                margin: 0 16px 24px 16px !important;
                width: auto !important;
                box-sizing: border-box;
                padding: 16px !important;
            }
            .pinned-shortcut-card {
                width: 100% !important;
                height: 100px !important;
            }
            .home-subtext {
                margin-left: 16px !important;
                margin-right: 16px !important;
            }
        }
"""

if broken_block in code:
    code = code.replace(broken_block, fixed_block)
    print("Fixed syntax error!")
else:
    print("Broken block not found exactly. Trying regex...")
    code = re.sub(r'/\* Pinned grid fix for mobile \*/.*?\n        }', fixed_block, code, flags=re.DOTALL)
    print("Used regex fix.")

with open('src/components/views/MainView.js', 'w', encoding='utf-8') as f:
    f.write(code)
