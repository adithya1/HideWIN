import re

path = r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\InviteView.js'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("@click=${this.createChannel}", "@click=${(e) => this.createChannel()}")
content = content.replace("@click=${this.copyInviteLink}", "@click=${(e) => this.copyInviteLink()}")

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
