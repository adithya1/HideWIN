import re

with open("src/components/app/HideWinApp.js", "r", encoding="utf-8") as f:
    code = f.read()

# 1. Add InviteView import at top if not present
if "InviteView" not in code:
    code = code.replace(
        "import { AuthView } from '../views/AuthView.js';",
        "import { AuthView } from '../views/AuthView.js';\nimport { InviteView } from '../views/InviteView.js';"
    )
    print("Added InviteView import")
else:
    print("InviteView import already present")

# 2. Add 'invite' nav item after Browse
invite_nav = """{ id: 'invite', label: 'Invite', icon: html\`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>\` },"""

if "id: 'invite'" not in code:
    # Insert after browse item
    code = code.replace(
        "{ id: 'browse', label: 'Browse', icon: html`",
        "{ id: 'browse', label: 'Browse', icon: html`"
    )
    # Insert invite after help item
    old_help = """{ id: 'help', label: 'Help', icon: html`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M12 3c7.2 0 9 1.8 9 9s-1.8 9-9 9s-9-1.8-9-9s1.8-9 9-9m0 13v.01"/><path d="M12 13a2 2 0 0 0 .914-3.782a1.98 1.98 0 0 0-2.414.483"/></g></svg>` }"""
    new_help = old_help + """,
            { id: 'invite', label: 'Invite', icon: html`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>` }"""
    if old_help in code:
        code = code.replace(old_help, new_help)
        print("Added invite nav item after Help")
    else:
        print("WARNING: Could not find Help nav item to insert Invite after")
else:
    print("Invite nav item already present")

# 3. Add 'invite' case in renderCurrentView
if "case 'invite':" not in code:
    old_case = """case 'help':
                return html`<help-view .onExternalLinkClick=${url => this.handleExternalLinkClick(url)}></help-view>`;"""
    new_case = old_case + """

            case 'invite':
                return html`<invite-view></invite-view>`;"""
    if old_case in code:
        code = code.replace(old_case, new_case)
        print("Added invite case to renderCurrentView")
    else:
        print("WARNING: Could not find help case to insert invite case after")
else:
    print("Invite case already present")

with open("src/components/app/HideWinApp.js", "w", encoding="utf-8") as f:
    f.write(code)
print("Done!")
