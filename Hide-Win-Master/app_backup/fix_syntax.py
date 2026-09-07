import re
with open("src/utils/gemini.js", "r", encoding="utf-8") as f:
    code = f.read()

# Fix syntax error if it exists
code = code.replace("manualGenerateContentStream(apiKey, ({", "manualGenerateContentStream(apiKey, {")

with open("src/utils/gemini.js", "w", encoding="utf-8") as f:
    f.write(code)

print("Fixed syntax error in gemini.js")
