import re

path = r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\InviteView.js'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

new_props = r'''
        this.controlRequests = new Set();
        this.activeControllerId = 'host';
        this.dataChannels = new Map();
        this.peers = new Map();
'''
content = content.replace("this.activeChannelId = null;", "this.activeChannelId = null;" + new_props)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
