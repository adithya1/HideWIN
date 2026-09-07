with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\app\HideWinApp.js', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(".meetingData=${this.activeMeetingData}", ".meetingData=${this.activeMeetingData}\n                                      .hostInitials=${this.getUserAvatarInitials()}")

with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\app\HideWinApp.js', 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated HideWinApp to pass hostInitials")
