import os

p = r"c:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\app\HideWinApp.js"
with open(p, "r", encoding="utf-8") as f:
    text = f.read()

text = text.replace("import '../views/HistoryView.js';", "import '../views/HistoryView.js';\nimport '../views/InviteView.js';")

case_rep = """case 'invite':
                return html`<invite-view></invite-view>`;
            case 'help':"""
text = text.replace("case 'help':", case_rep)

icon_rep = """{ id: 'invite', label: 'Invite', icon: html`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><line x1="19" y1="8" x2="19" y2="14"></line><line x1="22" y1="11" x2="16" y2="11"></line></svg>` },
            { id: 'help',"""
text = text.replace("{ id: 'help',", icon_rep)

with open(p, "w", encoding="utf-8") as f:
    f.write(text)
print("Restored Invite successfully!")
