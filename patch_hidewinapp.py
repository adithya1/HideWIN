with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\app\HideWinApp.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace schedule-meeting block
new_schedule = """            case 'schedule-meeting':
                return html`<schedule-meeting-view .editMeeting=${this.currentViewParams} @close-meeting=${() => { this.currentView = 'invite'; this.currentViewParams = null; this.requestUpdate(); }}></schedule-meeting-view>`;"""
content = content.replace("""            case 'schedule-meeting':
                return html`<schedule-meeting-view @close-meeting=${() => { this.currentView = 'invite'; this.requestUpdate(); }}></schedule-meeting-view>`;""", new_schedule)

# Add @edit-meeting to invite
new_invite = """            case 'invite':
                return html`<meeting-dashboard-view 
                    @new-meeting=${() => { this.currentViewParams = null; this.currentView = 'schedule-meeting'; this.requestUpdate(); }}
                    @edit-meeting=${(e) => { this.currentViewParams = e.detail; this.currentView = 'schedule-meeting'; this.requestUpdate(); }}"""
content = content.replace("""            case 'invite':
                return html`<meeting-dashboard-view 
                    @new-meeting=${() => { this.currentView = 'schedule-meeting'; this.requestUpdate(); }}""", new_invite)

with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\app\HideWinApp.js', 'w', encoding='utf-8') as f:
    f.write(content)
print("HideWinApp patched")
