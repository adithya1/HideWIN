with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\MeetingDashboardView.js', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    'const prefs = JSON.parse(prefsStr);',
    "const prefs = typeof prefsStr === 'string' ? JSON.parse(prefsStr) : prefsStr;"
)

with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\MeetingDashboardView.js', 'w', encoding='utf-8') as f:
    f.write(content)
print("Patched JSON.parse Dashboard")
