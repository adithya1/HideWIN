import re

with open('src/components/app/HideWinApp.js', 'r', encoding='utf-8') as f:
    code = f.read()

# Remove the broken placement completely
code = code.replace(
    'this.isMobileMenuOpen = false;\n        this.expandedDrawerMenus = { profile: false, settings: false };',
    'this.isMobileMenuOpen = false;'
)

# Insert properly into constructor
code = code.replace(
    "this.currentView = 'main';",
    "this.currentView = 'main';\n        this.expandedDrawerMenus = { profile: false, settings: false };"
)

with open('src/components/app/HideWinApp.js', 'w', encoding='utf-8') as f:
    f.write(code)

print("Fixed state initialization correctly this time.")
