import re

with open('src/components/views/MainView.js', 'r', encoding='utf-8') as f:
    code = f.read()

# Add display: none for mobile-field-label by default, and text-align left for desktop-value-span
desktop_css = """
        .mobile-field-label {
            display: none;
        }
        .desktop-value-span {
            text-align: left;
        }
"""
code = code.replace("/* --- Component Styles --- */", "/* --- Component Styles --- */\n" + desktop_css)

with open('src/components/views/MainView.js', 'w', encoding='utf-8') as f:
    f.write(code)

print("Fixed desktop label visibility.")
