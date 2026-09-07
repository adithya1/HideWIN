import re
with open("src/utils/gemini.js", "r", encoding="utf-8") as f:
    code = f.read()

# Let's find all instances of gemini-2.5-flash and replace with gemini-flash-latest
# And find all GoogleGenAI instantiations.
print(f"Total GoogleGenAI found: {code.count('new GoogleGenAI')}")
print(f"Total gemini-2.5-flash found: {code.count('gemini-2.5-flash')}")
