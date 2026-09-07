import re

with open("src/utils/gemini.js", "r", encoding="utf-8") as f:
    code = f.read()

# Replace any occurrence of new GoogleGenAI({ ... apiKey: apiKey ... })
# Just add httpOptions to the object.
def repl(m):
    obj = m.group(1)
    if "httpOptions" not in obj:
        # insert httpOptions before the closing brace
        obj = obj.rstrip()
        if obj.endswith('}'):
            obj = obj[:-1] + ", httpOptions: { headers: { 'x-goog-api-key': apiKey } } }"
    return f"new GoogleGenAI({obj})"

code = re.sub(r'new\s+GoogleGenAI\s*\(\s*(\{[\s\S]*?\})\s*\)', repl, code)

with open("src/utils/gemini.js", "w", encoding="utf-8") as f:
    f.write(code)

print("Patched all GoogleGenAI instantiations.")
