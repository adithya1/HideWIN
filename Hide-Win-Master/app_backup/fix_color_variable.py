import re

path_renderer = 'src/utils/renderer.js'
with open(path_renderer, 'r', encoding='utf-8') as f:
    ren_content = f.read()

target = r"root\.style\.colorScheme = isLight \? 'light' : 'dark';"
replacement = r"root.style.colorScheme = isLight ? 'light' : 'dark';\n        root.style.setProperty('--color-scheme', isLight ? 'light' : 'dark');"
ren_content = re.sub(target, replacement, ren_content)

with open(path_renderer, 'w', encoding='utf-8') as f:
    f.write(ren_content)

print("Fixed renderer.js to set --color-scheme variable!")
