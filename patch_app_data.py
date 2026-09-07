with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\app\HideWinApp.js', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(".prefillPasscode=${this.activeMeetingData.passcode}", ".prefillPasscode=${this.activeMeetingData.passcode}\n                                    .meetingData=${this.activeMeetingData}")

with open(r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\app\HideWinApp.js', 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated HideWinApp to pass meetingData")
