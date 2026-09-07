import re

with open("src/components/app/HideWinApp.js", "r", encoding="utf-8") as f:
    code = f.read()

# Fix the current wrong case 'invite' -> change it to show meeting-dashboard-view
# and add a 'schedule-meeting' case and 'meeting-room' case

# Replace the wrong invite case
old_invite_case = """case 'invite':
                return html`<invite-view></invite-view>`;"""

new_invite_case = """case 'invite':
                return html`
                    <meeting-dashboard-view
                        @new-meeting=${() => { this.navigate('schedule-meeting'); }}
                        @edit-meeting=${(e) => { this._editingMeeting = e.detail; this.navigate('schedule-meeting'); this.requestUpdate(); }}
                        @start-existing-meeting=${(e) => { this._meetingToStart = e.detail; this.navigate('meeting-room'); this.requestUpdate(); }}
                    ></meeting-dashboard-view>
                `;

            case 'schedule-meeting':
                return html`
                    <schedule-meeting-view
                        .editMeeting=${this._editingMeeting || null}
                        @meeting-saved=${() => { this._editingMeeting = null; this.navigate('invite'); }}
                        @close=${() => { this._editingMeeting = null; this.navigate('invite'); }}
                    ></schedule-meeting-view>
                `;

            case 'meeting-room':
                return html`
                    <invite-view
                        .prefillChannelId=${this._meetingToStart ? this._meetingToStart.id : ''}
                        .prefillPasscode=${this._meetingToStart ? (this._meetingToStart.passcode || '') : ''}
                        @minimize-meeting=${() => this.navigate('invite')}
                    ></invite-view>
                `;"""

if old_invite_case in code:
    code = code.replace(old_invite_case, new_invite_case)
    print("Fixed invite cases!")
else:
    print("WARNING: Could not find old invite case - checking for alternate format...")
    # Try without the extra space
    alt = "case 'invite':\n                return html`<invite-view></invite-view>`;"
    if alt in code:
        code = code.replace(alt, new_invite_case)
        print("Fixed invite cases (alternate format)!")
    else:
        print("FAILED: Could not find invite case")

with open("src/components/app/HideWinApp.js", "w", encoding="utf-8") as f:
    f.write(code)
print("Done!")
