import re
with open("src/utils/gemini.js", "r", encoding="utf-8") as f:
    code = f.read()

matches = re.findall(r'.{0,30}gemini-flash-latest.{0,30}', code)
for m in matches:
    print(m)
