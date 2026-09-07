import re

with open('src/utils/window.js', 'r', encoding='utf-8') as f:
    code = f.read()

old_size = "const DEFAULT_MAIN_WINDOW_SIZE = { width: 850, height: 850 };"
new_size = "const DEFAULT_MAIN_WINDOW_SIZE = { width: 1050, height: 800 };"

code = code.replace(old_size, new_size)

with open('src/utils/window.js', 'w', encoding='utf-8') as f:
    f.write(code)

print("Main window size patched")
