import sys, re

with open("src/utils/gemini.js", "r", encoding="utf-8") as f:
    code = f.read()

# Fix garbled text
code = code.replace("question: 'dYZT,? Spoken Question',", "question: '🎙️ Spoken Question',")
# Just in case the exact bytes were different due to reading
code = re.sub(r"question:\s*'[^']*Spoken Question',", "question: '🎙️ Spoken Question',", code)

with open("src/utils/gemini.js", "w", encoding="utf-8") as f:
    f.write(code)

print("Fixed garbled text in gemini.js")
