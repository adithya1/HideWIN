with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\ScheduleMeetingView.js', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    'const prefs = JSON.parse(prefsStr);',
    "const prefs = typeof prefsStr === 'string' ? JSON.parse(prefsStr) : prefsStr;"
)

content = content.replace(
    'const creds = JSON.parse(tokenResponse);',
    "const creds = typeof tokenResponse === 'string' ? JSON.parse(tokenResponse) : tokenResponse;"
)

with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\ScheduleMeetingView.js', 'w', encoding='utf-8') as f:
    f.write(content)
print("Patched JSON.parse")
