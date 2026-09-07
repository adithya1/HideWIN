import re

# 1. Update index.html
path_html = 'src/index.html'
with open(path_html, 'r', encoding='utf-8') as f:
    html_content = f.read()

# Replace hardcoded color-scheme: dark;
html_content = re.sub(r'color-scheme:\s*dark;', 'color-scheme: var(--color-scheme, dark);', html_content)

# Replace scrollbar-thumb
sb_thumb_old = r'::-webkit-scrollbar-thumb\s*\{\s*background-color:\s*rgba\(255,\s*255,\s*255,\s*0\.15\);'
sb_thumb_new = r'::-webkit-scrollbar-thumb {\n                background-color: var(--scrollbar-thumb, rgba(128, 128, 128, 0.4));'
html_content = re.sub(sb_thumb_old, sb_thumb_new, html_content)

sb_hover_old = r'::-webkit-scrollbar-thumb:hover\s*\{\s*background-color:\s*rgba\(255,\s*255,\s*255,\s*0\.3\);'
sb_hover_new = r'::-webkit-scrollbar-thumb:hover {\n                background-color: var(--scrollbar-thumb-hover, rgba(128, 128, 128, 0.6));'
html_content = re.sub(sb_hover_old, sb_hover_new, html_content)

with open(path_html, 'w', encoding='utf-8') as f:
    f.write(html_content)


# 2. Update renderer.js
path_renderer = 'src/utils/renderer.js'
with open(path_renderer, 'r', encoding='utf-8') as f:
    ren_content = f.read()

apply_bg_regex = r'(const isLight = \(baseRgb\.r \+ baseRgb\.g \+ baseRgb\.b\) / 3 > 128;.*?root\.style\.setProperty\(\'--scrollbar-background\', bgBase\);)'

def apply_bg_replacer(match):
    original = match.group(1)
    new_lines = """
        // Apply color-scheme dynamically for native elements (like select, scrollbars)
        root.style.setProperty('--color-scheme', isLight ? 'light' : 'dark');
        
        // Dynamically adjust scrollbar thumbs
        if (isLight) {
            root.style.setProperty('--scrollbar-thumb', 'rgba(0, 0, 0, 0.2)');
            root.style.setProperty('--scrollbar-thumb-hover', 'rgba(0, 0, 0, 0.4)');
        } else {
            root.style.setProperty('--scrollbar-thumb', 'rgba(255, 255, 255, 0.15)');
            root.style.setProperty('--scrollbar-thumb-hover', 'rgba(255, 255, 255, 0.3)');
        }
"""
    return original + new_lines

ren_content = re.sub(apply_bg_regex, apply_bg_replacer, ren_content, flags=re.DOTALL)

with open(path_renderer, 'w', encoding='utf-8') as f:
    f.write(ren_content)

print("Fixed color-scheme and scrollbar syncing!")
