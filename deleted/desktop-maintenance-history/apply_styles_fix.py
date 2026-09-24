file_path = r"c:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\app\HideWinApp.styles.js"
with open(file_path, 'r', encoding='utf-8') as f:
    code = f.read()

import re

# 1. Update .app-shell
code = re.sub(
    r'\.app-shell\s*\{\s*display:\s*flex;\s*flex-direction:\s*column;\s*height:\s*100%;\s*position:\s*relative;\s*\}',
    '.app-shell {\n        display: flex;\n        flex-direction: column;\n        position: absolute;\n        top: 48px;\n        left: 0;\n        width: 100%;\n        height: calc(100vh - 48px);\n        overflow: hidden;\n        background: var(--bg-app);\n        border: 3px solid var(--border);\n        border-radius: 8px;\n        box-sizing: border-box;\n    }',
    code
)

# 2. Fix scrollbar color
code = re.sub(r'::-webkit-scrollbar-thumb\s*\{\s*background:\s*var\(--border-strong\);\s*border-radius:\s*3px;\s*\}', '::-webkit-scrollbar-thumb {\n        background: rgba(150, 150, 150, 0.4) !important;\n        border-radius: 10px;\n    }', code)
code = re.sub(r'::-webkit-scrollbar-thumb:hover\s*\{\s*background:\s*#444444;\s*\}', '::-webkit-scrollbar-thumb:hover {\n        background: rgba(150, 150, 150, 0.6) !important;\n    }', code)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(code)

print("SUCCESS")
