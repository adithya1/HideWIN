import os

p = r"c:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\app\HideWinApp.js"
with open(p, "r", encoding="utf-8") as f:
    text = f.read()

if "MeetingDashboardView.js" not in text:
    text = text.replace("import '../views/InviteView.js';", "import '../views/InviteView.js';\nimport '../views/MeetingDashboardView.js';\nimport '../views/ScheduleMeetingView.js';")

old_invite = "case 'invite':\n                return html`<invite-view></invite-view>`;"
new_invite = """case 'invite':
                return html`<meeting-dashboard-view @new-meeting=${() => { this.currentView = 'schedule_meeting'; this.requestUpdate(); }}></meeting-dashboard-view>`;
            case 'schedule_meeting':
                return html`<schedule-meeting-view @close-meeting=${() => { this.currentView = 'invite'; this.requestUpdate(); }}></schedule-meeting-view>`;"""

if old_invite in text:
    text = text.replace(old_invite, new_invite)
    print("Replaced old_invite!")
else:
    print("old_invite not found!")

with open(p, "w", encoding="utf-8") as f:
    f.write(text)
