import re

p = r"c:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\app\HideWinApp.js"
with open(p, "r", encoding="utf-8") as f:
    text = f.read()

# Find the Browse nav item and add Invite right after it
browse_item = "{ id: 'browse', label: 'Browse',"
invite_item = """{ id: 'invite', label: 'Invite', icon: html`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>` },"""

# Find the browse item line and insert invite after it
idx = text.find(browse_item)
if idx == -1:
    print("Browse item not found!")
else:
    # Find the end of this line
    end_of_line = text.find('\n', idx)
    text = text[:end_of_line+1] + "            " + invite_item + "\n" + text[end_of_line+1:]
    print("Added Invite nav item!")

with open(p, "w", encoding="utf-8") as f:
    f.write(text)
