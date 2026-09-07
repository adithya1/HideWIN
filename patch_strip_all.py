import re
with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\InviteView.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Strip out ALL instances of window.hideWin.storage.getCredentials().then(creds => { ... this.hostInitials = ... })
content = re.sub(r'window\.hideWin\.storage\.getCredentials\(\)\.then\(creds => \{[\s\S]*?this\.hostInitials[\s\S]*?\}\)\.catch\(e => \{ console\.warn\(e\); \}\);', '', content)

with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\InviteView.js', 'w', encoding='utf-8') as f:
    f.write(content)
print("Stripped all rogue hostInitials fetch code")
