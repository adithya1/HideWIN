import re
import os

# 1. Update App.jsx
path = 'src/App.jsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Remove imports
content = re.sub(r"import Admin from './pages/Admin';\n", "", content)
content = re.sub(r"import AdminLogin from './pages/AdminLogin';\n", "", content)

# Remove adminPath const
content = re.sub(r"\s*const adminPath = import\.meta\.env\.VITE_ADMIN_PATH \|\| '/admin_hw';\n", "", content)

# Remove routes
admin_routes = r"\s*\{\/\* Secret Admin Routes \*\/\}\s*<Route path=\{adminPath\} element=\{<AdminLogin \/>\} \/>\s*<Route path=\"\/admin\/dashboard\" element=\{<Admin \/>\} \/>"
content = re.sub(admin_routes, "", content)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)

# 2. Delete the Admin.jsx and AdminLogin.jsx
if os.path.exists('src/pages/Admin.jsx'):
    os.remove('src/pages/Admin.jsx')
if os.path.exists('src/pages/AdminLogin.jsx'):
    os.remove('src/pages/AdminLogin.jsx')

print("Removed Admin panel from Web App")
