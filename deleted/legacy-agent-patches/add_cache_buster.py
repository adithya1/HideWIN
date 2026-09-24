import os
import re

p = r"C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\InviteView.js"
with open(p, "r", encoding="utf-8") as f:
    text = f.read()

# Add cache-buster to the invite link
old_link = "const fullLink = `${protocol}://${host}/invite/index.html?channel=${this.activeChannelId}&passcode=${this.hostToken}`;"
new_link = "const fullLink = `${protocol}://${host}/invite/index.html?channel=${this.activeChannelId}&passcode=${this.hostToken}&_t=${Date.now()}`;"

if old_link in text:
    text = text.replace(old_link, new_link)
    with open(p, "w", encoding="utf-8") as f:
        f.write(text)
    print("Added cache buster!")
else:
    print("Could not find old link!")
