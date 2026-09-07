import re

with open('src/components/views/MainView.js', 'r', encoding='utf-8') as f:
    main = f.read()

# Make the dropdown values hyper-compact for mobile
compact_css = """
        @media (max-width: 768px) {
            .desktop-value-span {
                font-size: 13px !important;
                text-align: left !important;
            }
            .pill-dropdown-inner svg {
                width: 14px !important;
                height: 14px !important;
            }
        }
"""
if ".desktop-value-span {" not in main:
    main = main.replace("/* --- Component Styles --- */", "/* --- Component Styles --- */\n" + compact_css)

with open('src/components/views/MainView.js', 'w', encoding='utf-8') as f:
    f.write(main)

print("Applied hyper-compact styling to the dropdown text.")
