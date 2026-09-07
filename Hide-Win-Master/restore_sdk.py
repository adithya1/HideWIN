import sys

with open("src/utils/gemini.js", "r", encoding="utf-8") as f:
    code = f.read()

import re

# Remove manualGenerateContentStream entirely
code = re.sub(r'// --- CUSTOM NATIVE STREAMING BYPASS ---[\s\S]*?\}\)\(\);\n\}', '', code)

# Put back ai.models.generateContentStream where manualGenerateContentStream was used
code = code.replace("await manualGenerateContentStream(apiKey.trim(), {", "await ai.models.generateContentStream({")

with open("src/utils/gemini.js", "w", encoding="utf-8") as f:
    f.write(code)

print("Restored official SDK streaming methods!")
