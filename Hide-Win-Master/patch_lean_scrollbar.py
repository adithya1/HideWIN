import re

# Update index.html
with open('src/index.html', 'r', encoding='utf-8') as f:
    code = f.read()

old_scroll = """            /* HIDE ALL SCROLLBARS GLOBALLY FOR NATIVE APP FEEL */
            ::-webkit-scrollbar {
                display: none !important;
                width: 0 !important;
                height: 0 !important;
            }
            * {
                -ms-overflow-style: none;
                scrollbar-width: none;
            }"""

new_scroll = """            /* GLOBAL POSH LEAN SCROLLBAR */
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

code = code.replace(old_scroll, new_scroll)

with open('src/index.html', 'w', encoding='utf-8') as f:
    f.write(code)


# Update HideWinApp.js
with open('src/components/app/HideWinApp.js', 'r', encoding='utf-8') as f:
    code2 = f.read()

old_scroll2 = """        ::-webkit-scrollbar {
            display: none !important;
            width: 0 !important;
            height: 0 !important;
        }
        * {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }"""

new_scroll2 = """        ::-webkit-scrollbar {
            width: 10px;
            height: 10px;
        }
        ::-webkit-scrollbar-track {
            background: transparent;
        }
        ::-webkit-scrollbar-thumb {
            background-color: #c1c1c1;
            border-radius: 10px;
            border: 3px solid transparent;
            background-clip: padding-box;
        }
        ::-webkit-scrollbar-thumb:hover {
            background-color: #a8a8a8;
        }
        ::-webkit-scrollbar-button:single-button {
            background-color: transparent;
            display: block;
            height: 12px;
            width: 10px;
        }
        ::-webkit-scrollbar-button:single-button:vertical:decrement {
            background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23c1c1c1'><path d='M7 14l5-5 5 5z'/></svg>");
            background-size: 8px;
            background-position: center;
            background-repeat: no-repeat;
        }
        ::-webkit-scrollbar-button:single-button:vertical:increment {
            background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23c1c1c1'><path d='M7 10l5 5 5-5z'/></svg>");
            background-size: 8px;
            background-position: center;
            background-repeat: no-repeat;
        }"""

code2 = code2.replace(old_scroll2, new_scroll2)

with open('src/components/app/HideWinApp.js', 'w', encoding='utf-8') as f:
    f.write(code2)

print("Injected lean posh scrollbar globally")
