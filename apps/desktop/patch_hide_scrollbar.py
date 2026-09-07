import re

with open('src/index.html', 'r', encoding='utf-8') as f:
    code = f.read()

# Replace the POSH SCROLLBAR with a completely hidden one
old_scroll_regex = r'/\* GLOBAL POSH SCROLLBAR.*?\*/.*?::-webkit-scrollbar-button:single-button:vertical:increment \{.*?\}'
new_scroll = """/* GLOBAL NATIVE APP FEEL - HIDE SCROLLBARS VISUALLY */
            ::-webkit-scrollbar {
                width: 0px !important;
                height: 0px !important;
                display: none !important;
                background: transparent !important;
            }"""

code = re.sub(old_scroll_regex, new_scroll, code, flags=re.DOTALL)

# Add overflow-x: hidden to body
if 'overflow-x: hidden' not in code:
    code = code.replace(
        'body {',
        'body {\n            overflow-x: hidden;'
    )

with open('src/index.html', 'w', encoding='utf-8') as f:
    f.write(code)

print("Patched index.html to hide scrollbars globally")
