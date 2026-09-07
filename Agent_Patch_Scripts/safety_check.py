import os
p = r"C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\InviteView.js"
with open(p, "r", encoding="utf-8") as f:
    text = f.read()

# Add a check before copying to clipboard
old_copy = "copyInviteLink() {"
new_copy = """copyInviteLink() {
        if (!this.hostToken) {
            alert('Error: Not connected to Signaling Server! Please ensure your Python backend is running on the correct IP and Port, then try creating the channel again.');
            return;
        }"""

if "if (!this.hostToken)" not in text:
    text = text.replace(old_copy, new_copy)
    with open(p, "w", encoding="utf-8") as f:
        f.write(text)
    print("Added safety check for clipboard")
