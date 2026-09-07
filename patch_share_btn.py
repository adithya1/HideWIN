with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\InviteView.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the button click handler for "Share"
old_btn = """@click=${() => this.localStream ? this.stopSharing() : this.startScreenShare()}"""
new_btn = """@click=${() => this.localStream ? this.showToast("Screen is already in share mode!", "success") : this.startScreenShare()}"""

content = content.replace(old_btn, new_btn)

# We should also update stopSharing() to not wipe the meeting state?
# No, stopSharing() is used for "Stop Sharing" in other places or when tracks end. But actually if the meeting is going, maybe they want to stop sharing screen without ending the meeting.
# The user said "remove that page and fix the issue, show a popup screen is already in share mode". I'll just change the button click.

with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\InviteView.js', 'w', encoding='utf-8') as f:
    f.write(content)
print("Patched share button")
