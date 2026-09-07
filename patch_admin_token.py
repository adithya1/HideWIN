with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Web\src\pages\Admin.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("localStorage.getItem('admin_token')", "localStorage.getItem('hidewin_token')")

with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Web\src\pages\Admin.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
print("Patched Admin.jsx token key")
