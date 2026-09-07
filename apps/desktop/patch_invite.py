import re
path = r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\InviteView.js'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Add properties if not there
if "prefillChannelId" not in content:
    content = content.replace("static properties = {", "static properties = {\n        prefillChannelId: { type: String },\n        prefillPasscode: { type: String },")

create = """
            if (this.prefillChannelId) {
                this.activeChannelId = this.prefillChannelId;
            } else {
                this.activeChannelId = 'HW-' + Math.random().toString(36).substring(2, 6).toUpperCase() + '-' + Math.random().toString(36).substring(2, 6).toUpperCase();
            }
"""
content = re.sub(r"this\.activeChannelId = 'HW-' \+ Math\.random\(\)\.toString.*?toUpperCase\(\);", create.strip(), content)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
