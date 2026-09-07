import sys
import re

with open("src/utils/gemini.js", "r", encoding="utf-8") as f:
    code = f.read()

# Remove apiKey retrieval and validation from startGeminiSession
code = re.sub(r"const apiKey = \(getApiKey\(\) \|\| ''\)\.trim\(\);\s*if \(\!apiKey\) \{.*?(?:return|throw).*?\}", "", code, flags=re.DOTALL)

with open("src/utils/gemini.js", "w", encoding="utf-8") as f:
    f.write(code)

print("Removed local API key validation from gemini.js")
