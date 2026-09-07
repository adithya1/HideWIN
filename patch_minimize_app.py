with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\app\HideWinApp.js', 'r', encoding='utf-8') as f:
    content = f.read()

old_event = """.prefillPasscode=${this.activeMeetingData.passcode}
                                    .meetingData=${this.activeMeetingData}
                                      .hostInitials=${this.getUserAvatarInitials()}
                                    @close-meeting="""

new_event = """.prefillPasscode=${this.activeMeetingData.passcode}
                                    .meetingData=${this.activeMeetingData}
                                      .hostInitials=${this.getUserAvatarInitials()}
                                    @minimize-meeting=${() => { this.currentView = 'invite'; this.requestUpdate(); }}
                                    @close-meeting="""
                                    
content = content.replace(old_event, new_event)

with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\app\HideWinApp.js', 'w', encoding='utf-8') as f:
    f.write(content)
print("Added minimize-meeting listener to HideWinApp")
