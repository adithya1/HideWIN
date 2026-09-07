import re

with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\MeetingDashboardView.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Make cards clickable
content = re.sub(r'<div class="posh-card">', r'<div class="posh-card" @click=${(e) => { if(!e.target.closest("button")) this.startMeeting(m); }} style="cursor: pointer;">', content)
content = re.sub(r'<div class="posh-list-item">', r'<div class="posh-list-item" @click=${(e) => { if(!e.target.closest("button")) this.startMeeting(m); }} style="cursor: pointer;">', content)

with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\views\MeetingDashboardView.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("Applied click handlers")
