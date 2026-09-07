import re

path_renderer = 'src/utils/renderer.js'
with open(path_renderer, 'r', encoding='utf-8') as f:
    ren_content = f.read()

target = r'// Also apply background colors from theme\s*\},'
replacement = r'// Also apply background colors from theme\n        this.applyBackgrounds(colors.background, alpha);\n    },'
ren_content = re.sub(target, replacement, ren_content)

with open(path_renderer, 'w', encoding='utf-8') as f:
    f.write(ren_content)

print("Fixed renderer.js apply method!")
