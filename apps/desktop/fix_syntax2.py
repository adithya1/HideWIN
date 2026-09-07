import re

path_renderer = 'src/utils/renderer.js'
with open(path_renderer, 'r', encoding='utf-8') as f:
    ren_content = f.read()

# Remove the broken statement
ren_content = re.sub(r'\s*this\.applyBackgrounds\(colors\.background, alpha\);\s*async load\(\)\s*\{', '\n\n    async load() {', ren_content)

# Add it back INSIDE apply()
apply_end = r'(\s+)(\}\s*async load\(\)\s*\{)'
replacement = r'\1    this.applyBackgrounds(colors.background, alpha);\1\2'
ren_content = re.sub(apply_end, replacement, ren_content)

with open(path_renderer, 'w', encoding='utf-8') as f:
    f.write(ren_content)

print("Fixed syntax error again!")
