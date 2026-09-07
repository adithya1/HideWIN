import re
path = r'C:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\app\HideWinApp.js'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("<invite-view></invite-view>", "<invite-view .prefillChannelId=${this.currentViewParams?.id} .prefillPasscode=${this.currentViewParams?.passcode}></invite-view>")

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
