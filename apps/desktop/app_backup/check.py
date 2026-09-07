import re
path = r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\app\HideWinApp.js'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Remove calendar from sidebar
content = re.sub(r'\{ id: \'calendar\'.*?\},?\n', '', content)
# Remove case 'calendar': and replace case 'invite': with the calendar logic
old_invite = r"""            case 'invite':
                return html`<invite-view .prefillChannelId=\$\{this.currentViewParams\?\.id\} .prefillPasscode=\$\{this.currentViewParams\?\.passcode\}></invite-view>`;"""

new_invite = r"""            case 'invite':
                return html`<meeting-dashboard-view 
                    @new-meeting=${() => { this.currentView = 'schedule-meeting'; this.requestUpdate(); }}
                    @start-existing-meeting=${(e) => { 
                        this.currentViewParams = e.detail;
                        this.currentView = 'active-meeting-view'; 
                        this.requestUpdate(); 
                    }}
                ></meeting-dashboard-view>`;"""

# Wait, if they start the meeting, what view should it open?
# The old InviteView handled BOTH channel creation AND the active meeting lobby.
# But InviteView has the old UI.
