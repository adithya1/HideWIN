import re
path = r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\app\HideWinApp.js'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Remove calendar sidebar item
content = re.sub(r'\{ id: \'calendar\'.*?\},?\n', '', content)

# 2. Re-map routing
routing = r"""
            case 'invite':
                return html`<meeting-dashboard-view 
                    @new-meeting=${() => { this.currentView = 'schedule-meeting'; this.requestUpdate(); }}
                    @start-existing-meeting=${(e) => { 
                        this.currentViewParams = e.detail;
                        this.currentView = 'active-meeting'; 
                        this.requestUpdate(); 
                    }}
                ></meeting-dashboard-view>`;
            case 'schedule-meeting':
                return html`<schedule-meeting-view @close-meeting=${() => { this.currentView = 'invite'; this.requestUpdate(); }}></schedule-meeting-view>`;
            case 'active-meeting':
                return html`<invite-view .prefillChannelId=${this.currentViewParams?.id} .prefillPasscode=${this.currentViewParams?.passcode}></invite-view>`;
"""

# Replace all of those cases
content = re.sub(r"case 'calendar':.*?</invite-view>`;", routing.strip(), content, flags=re.DOTALL)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
