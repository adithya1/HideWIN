import re

with open('src/components/app/HideWinApp.js', 'r', encoding='utf-8') as f:
    code = f.read()

old_scroll_regex = r'::-webkit-scrollbar \{.*?::-webkit-scrollbar-button:single-button:vertical:increment \{.*?\}'
new_scroll = """::-webkit-scrollbar {
            width: 0px !important;
            height: 0px !important;
            display: none !important;
        }"""

code = re.sub(old_scroll_regex, new_scroll, code, flags=re.DOTALL)

with open('src/components/app/HideWinApp.js', 'w', encoding='utf-8') as f:
    f.write(code)

print("Patched app to hide scrollbars")
