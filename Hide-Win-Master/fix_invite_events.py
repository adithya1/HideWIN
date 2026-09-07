import re

with open("src/components/app/HideWinApp.js", "r", encoding="utf-8") as f:
    code = f.read()

# Fix schedule-meeting case to use the correct 'close-meeting' event
old_schedule = """case 'schedule-meeting':
                return html`
                    <schedule-meeting-view
                        .editMeeting=${this._editingMeeting || null}
                        @meeting-saved=${() => { this._editingMeeting = null; this.navigate('invite'); }}
                        @close=${() => { this._editingMeeting = null; this.navigate('invite'); }}
                    ></schedule-meeting-view>
                `;"""

new_schedule = """case 'schedule-meeting':
                return html`
                    <schedule-meeting-view
                        .editMeeting=${this._editingMeeting || null}
                        @close-meeting=${() => { this._editingMeeting = null; this.navigate('invite'); }}
                    ></schedule-meeting-view>
                `;"""

if old_schedule in code:
    code = code.replace(old_schedule, new_schedule)
    print("Fixed schedule-meeting events!")
else:
    print("WARNING: schedule-meeting case not found")

with open("src/components/app/HideWinApp.js", "w", encoding="utf-8") as f:
    f.write(code)
print("Done!")
