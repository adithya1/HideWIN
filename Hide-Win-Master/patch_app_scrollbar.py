import re

with open('src/components/app/HideWinApp.js', 'r', encoding='utf-8') as f:
    code = f.read()

old_scroll = """        ::-webkit-scrollbar {
            width: 6px;
            height: 6px;
        }

        ::-webkit-scrollbar-track {
            background: transparent;
        }

        ::-webkit-scrollbar-thumb {
            background: var(--border-strong);
            border-radius: 3px;
        }

        ::-webkit-scrollbar-thumb:hover {
            background: #444444;
        }"""

new_scroll = """        ::-webkit-scrollbar {
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
            height: 10px;
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

code = code.replace(old_scroll, new_scroll)

with open('src/components/app/HideWinApp.js', 'w', encoding='utf-8') as f:
    f.write(code)

print("Patched app scrollbar")
