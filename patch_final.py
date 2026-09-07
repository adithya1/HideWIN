import re

for filepath in [r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\ScheduleMeetingView.js', r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\MeetingDashboardView.js']:
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Fix prefs
    content = content.replace(
        "const prefs = typeof prefsStr === 'string' ? JSON.parse(prefsStr) : prefsStr;",
        "let prefs = typeof prefsStr === 'string' ? JSON.parse(prefsStr) : prefsStr;\n                 if (prefs && prefs.data) prefs = prefs.data;"
    )

    # Fix creds
    content = content.replace(
        "const creds = typeof tokenResponse === 'string' ? JSON.parse(tokenResponse) : tokenResponse;",
        "let creds = typeof tokenResponse === 'string' ? JSON.parse(tokenResponse) : tokenResponse;\n                if (creds && creds.data) creds = creds.data;"
    )

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

print("Patched correctly!")
