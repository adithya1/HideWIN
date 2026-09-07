import re

p = r"c:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\app\HideWinApp.js"
with open(p, "r", encoding="utf-8") as f:
    text = f.read()

# Find invite case
m = re.search(r"case 'invite'.*?break;", text, re.DOTALL)
if m:
    print("INVITE CASE:")
    print(m.group(0))
else:
    # Try to find section
    idx = text.find("case 'invite'")
    if idx >= 0:
        print("Invite found at", idx)
        print(text[idx:idx+400])
    else:
        print("NO INVITE CASE FOUND!")
