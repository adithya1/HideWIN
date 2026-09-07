import re

with open('src/components/app/HideWinApp.js', 'r', encoding='utf-8') as f:
    code = f.read()

# Remove misplaced init
code = code.replace(
    'this.isMobileMenuOpen = false;\n        this.expandedDrawerMenus = { profile: false, settings: false };',
    'this.isMobileMenuOpen = false;'
)

# Insert into constructor
code = code.replace(
    'this.isMobileMenuOpen = false;',
    'this.isMobileMenuOpen = false;\n        this.expandedDrawerMenus = { profile: false, settings: false };',
    1 # Only the first occurrence, which is in constructor
)

with open('src/components/app/HideWinApp.js', 'w', encoding='utf-8') as f:
    f.write(code)

print("Fixed drawer state initialization.")
