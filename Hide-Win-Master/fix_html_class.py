file_path = r"c:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\app\HideWinApp.js"
with open(file_path, 'r', encoding='utf-8') as f:
    code = f.read()

import re
code = re.sub(
    r'(updated\(changedProperties\)\s*\{.*?)(if\s*\(changedProperties\.has\(\'themeMain\'\)\)\s*\{)',
    r"\1if (changedProperties.has('sessionActive') || changedProperties.has('isPaused')) {\n            const isSession = this.sessionActive && !this.isPaused;\n            if (isSession) {\n                document.documentElement.classList.add('is-session');\n                document.documentElement.setAttribute('data-theme', 'dark');\n            } else {\n                document.documentElement.classList.remove('is-session');\n                document.documentElement.setAttribute('data-theme', this.themeMain || 'dark');\n            }\n        }\n        \2",
    code,
    flags=re.DOTALL
)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(code)

print("SUCCESS")
