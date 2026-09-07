with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\InviteView.js', 'r', encoding='utf-8') as f:
    content = f.read()

old_toast = """this.showToast("Channel Created Successfully!", "success");"""
new_toast = """this.showToast(this.prefillChannelId ? "Connected to Meeting!" : "Channel Created Successfully!", "success");"""
content = content.replace(old_toast, new_toast)

with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\InviteView.js', 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated WS success message")
