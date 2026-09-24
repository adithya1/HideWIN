file_path = r"c:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\app\HideWinAppRenderers.js"
with open(file_path, 'r', encoding='utf-8') as f:
    code = f.read()

import re
code = re.sub(
    r"url\('\./assets/images/media_1786601281022\.png'\);\s*background-size:\s*auto 32px;\s*background-position:\s*left center;\s*background-repeat:\s*no-repeat;\s*margin-left:\s*4px;\s*transform:\s*scale\(1\.35\);\s*transform-origin:\s*left center;",
    "url('./assets/images/media_1786601281022.png'); background-size: auto 32px; background-position: left center; background-repeat: no-repeat; margin-left: 4px; transform: scale(1.35); transform-origin: left center; filter: brightness(0) invert(1);",
    code
)

# Also let's make sure the pill background is that sleek dark glassmorphism
code = re.sub(
    r"background: var\(--bg-surface\);\s*border: 1px solid rgba\(255,255,255,0\.15\);",
    "background: rgba(30,32,38,0.95); backdrop-filter: blur(20px); border: 1px solid rgba(255,255,255,0.15);",
    code
)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(code)

print("SUCCESS")
