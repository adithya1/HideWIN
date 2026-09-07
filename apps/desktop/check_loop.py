import re
with open("src/utils/gemini.js", "r", encoding="utf-8") as f:
    code = f.read()

# Let's see the loop where the stream is consumed
match = re.search(r'for await \(const chunk of response\) \{[\s\S]*?\}', code)
if match:
    print(match.group(0))
