import re

path_renderer = 'src/utils/renderer.js'
with open(path_renderer, 'r', encoding='utf-8') as f:
    ren_content = f.read()

# 1. Remove the recursive call inside applyBackgrounds if it's there
recursive_call = r'\s*this\.applyBackgrounds\(colors\.background, alpha\);\s*\}\,'
ren_content = re.sub(recursive_call, '\n    },', ren_content)

# 2. Add the call to applyBackgrounds at the end of apply()
# apply() ends before load()
# Let's just find the end of apply() by looking for async load()
apply_end = r'(\s*)(async load\(\)\s*\{)'
replacement = r'\1    this.applyBackgrounds(colors.background, alpha);\n\1\2'
ren_content = re.sub(apply_end, replacement, ren_content)

with open(path_renderer, 'w', encoding='utf-8') as f:
    f.write(ren_content)

print("Fixed renderer.js applyBackgrounds invocation!")
