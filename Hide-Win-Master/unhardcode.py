import re
with open("src/utils/gemini.js", "r", encoding="utf-8") as f:
    code = f.read()

# Replace hardcoded 'gemini-flash-latest' with getAvailableModel() where applicable
code = code.replace("model: 'gemini-flash-latest',", "model: getAvailableModel(),")

with open("src/utils/gemini.js", "w", encoding="utf-8") as f:
    f.write(code)

print("Replaced hardcoded models with getAvailableModel() in gemini.js")
