import re

# Update index.html
with open('src/index.html', 'r', encoding='utf-8') as f:
    code = f.read()

pattern = r'/\* GLOBAL NATIVE APP FEEL - HIDE SCROLLBARS VISUALLY \*/\s*::-webkit-scrollbar \{.*?\}'

new_scroll = """/* GLOBAL POSH LEAN SCROLLBAR */
            ::-webkit-scrollbar {
                width: 10px !important;
                height: 10px !important;
            }
            ::-webkit-scrollbar-track {
                background: transparent !important;
            }
            ::-webkit-scrollbar-thumb {
                background-color: #c1c1c1 !important;
                border-radius: 10px !important;
                border: 3px solid transparent !important;
                background-clip: padding-box !important;
            }
            ::-webkit-scrollbar-thumb:hover {
                background-color: #a8a8a8 !important;
            }
            ::-webkit-scrollbar-button:single-button {
                background-color: transparent !important;
                display: block !important;
                height: 12px !important;
                width: 10px !important;
            }
            ::-webkit-scrollbar-button:single-button:vertical:decrement {
                background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23c1c1c1'><path d='M7 14l5-5 5 5z'/></svg>") !important;
                background-size: 8px !important;
                background-position: center !important;
                background-repeat: no-repeat !important;
            }
            ::-webkit-scrollbar-button:single-button:vertical:increment {
                background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23c1c1c1'><path d='M7 10l5 5 5-5z'/></svg>") !important;
                background-size: 8px !important;
                background-position: center !important;
                background-repeat: no-repeat !important;
            }"""

code = re.sub(pattern, new_scroll, code, flags=re.DOTALL)

with open('src/index.html', 'w', encoding='utf-8') as f:
    f.write(code)
print("index.html patched")
