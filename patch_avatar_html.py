with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\InviteView.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix the main stage avatar
old_avatar = """<div class="avatar-circle">
                                        ${this.channelName ? this.channelName.substring(0, 2).toUpperCase() : 'HW'}
                                    </div>"""
new_avatar = """<div class="avatar-circle">
                                        ${this.hostInitials}
                                    </div>"""
content = content.replace(old_avatar, new_avatar)

# Also fix the participant-item if the host is listed there?
# The host isn't listed in participants.length usually. But we can check.

with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\InviteView.js', 'w', encoding='utf-8') as f:
    f.write(content)
print("Fixed avatar HTML")
