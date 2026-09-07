import re
with open("src/utils/gemini.js", "r", encoding="utf-8") as f:
    code = f.read()

matches = re.finditer(r'const response = await ai\.models\.generateContentStream\(\{[\s\S]*?\}\);', code)
for m in matches:
    print(m.group(0))
    print("---")
