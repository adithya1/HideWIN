import re

filepath = r"c:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\utils\gemini.js"
with open(filepath, "r", encoding="utf-8") as f:
    content = f.read()

target = r"const result = JSON\.parse\(data\.toString\(\)\);\s*if \(result\.text\) \{\s*const text = result\.text\.trim\(\);"
replacement = r"""const result = JSON.parse(data.toString());
                const rawText = result.transcript || result.text;
                if (rawText) {
                    const text = rawText.trim();"""

content = re.sub(target, replacement, content)

with open(filepath, "w", encoding="utf-8") as f:
    f.write(content)
print("Fixed STT JSON parsing in gemini.js")
