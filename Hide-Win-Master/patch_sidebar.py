import re
path = r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\app\HideWinApp.js'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Add Calendar to views array
calendar_item = """            { id: 'calendar', label: 'Calendar', icon: html`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>` },\n"""
content = re.sub(r"(\{\s*id:\s*'browse',\s*label:\s*'Browse'.*?\},)", r"\1\n" + calendar_item, content, flags=re.DOTALL)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
