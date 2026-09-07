import re

filepath = r"c:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\app\HideWinApp.js"
with open(filepath, "r", encoding="utf-8") as f:
    content = f.read()

target = r"\.isClickThrough=\$\{this\._isClickThrough\}"
replacement = r".isClickThrough=${this._isClickThrough}\n                        .liveTranscription=${this.liveTranscription}"

content = re.sub(target, replacement, content)

with open(filepath, "w", encoding="utf-8") as f:
    f.write(content)
print("Added liveTranscription prop to assistant-view")
