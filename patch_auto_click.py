import re

path = r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\InviteView.js'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

injection = r'''
    async firstUpdated() {
        console.error("DIAGNOSTIC: InviteView firstUpdated is running!");
        setTimeout(() => {
            console.error("DIAGNOSTIC: Auto-triggering createChannel()");
            this.createChannel();
        }, 3000);
'''
content = content.replace("    async firstUpdated() {", injection)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
