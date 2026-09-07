import re
with open("src/utils/gemini.js", "r", encoding="utf-8") as f:
    code = f.read()

# Make sure we trim the api key when we get it
code = code.replace("const apiKey = getApiKey();", "const apiKey = (getApiKey() || '').trim();")

# I will also rewrite the manualGenerateContentStream to make absolutely sure it trims it
code = code.replace("manualGenerateContentStream(apiKey, ", "manualGenerateContentStream(apiKey.trim(), ")

with open("src/utils/gemini.js", "w", encoding="utf-8") as f:
    f.write(code)

print("Added strict .trim() to all API key usages in gemini.js")
