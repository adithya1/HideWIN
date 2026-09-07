import re
with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\InviteView.js', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("name: 'You'", "name: 'You (Host)'")
# Also fix the chat message render which checks for 'You'
content = content.replace("m.sender === 'You'", "m.sender === 'You (Host)'")
# And when sending a chat message, set the sender to 'You (Host)'
content = content.replace("sender: 'You'", "sender: 'You (Host)'")

with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\InviteView.js', 'w', encoding='utf-8') as f:
    f.write(content)
print("Fixed You (Host) label")
