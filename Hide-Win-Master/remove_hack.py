import re
with open("src/utils/gemini.js", "r", encoding="utf-8") as f:
    code = f.read()

# Remove the httpOptions hack
code = code.replace(", httpOptions: { headers: { 'x-goog-api-key': apiKey } }", "")
code = code.replace(", httpOptions: { headers: { 'x-goog-api-key': apiKey.trim() } }", "")

with open("src/utils/gemini.js", "w", encoding="utf-8") as f:
    f.write(code)

print("Removed httpOptions hack from GoogleGenAI instantiation.")
