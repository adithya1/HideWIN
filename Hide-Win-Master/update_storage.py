import re
with open("src/storage.js", "r", encoding="utf-8") as f:
    code = f.read()

# Make sure gemini-flash-latest is the primary fallback model for all API calls
code = code.replace("'gemini-2.5-flash',", "'gemini-flash-latest',")

with open("src/storage.js", "w", encoding="utf-8") as f:
    f.write(code)

print("Updated storage.js to use gemini-flash-latest as the primary default model.")
