import re

filepath = r"Hide-Win-Master\src\utils\gemini.js"
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# remove duplicate declarations
content = re.sub(r'let oralAudioChunks = \[\];\s*let totalOralPcmBytes = 0;\s*let oralAudioChunks = \[\];\s*let totalOralPcmBytes = 0;', 'let oralAudioChunks = [];\nlet totalOralPcmBytes = 0;', content)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
