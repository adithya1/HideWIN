import re

filepath = r"c:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\utils\renderer.js"
with open(filepath, "r", encoding="utf-8") as f:
    content = f.read()

# Remove the eager addNewResponse block in Auto-Submit
eager_placeholder = r"""                if \(typeof app\.addNewResponse === 'function'\) \{
                    app\.addNewResponse\(\{
                        question: questionWithPunctuation,
                        answer: '⏳ \*Generating response\.\.\.\*'
                    \}\);
                \}"""
content = re.sub(eager_placeholder, "", content)

# Remove the eager addNewResponse block in Manual-Submit (second match)
content = re.sub(eager_placeholder, "", content)

with open(filepath, "w", encoding="utf-8") as f:
    f.write(content)
print("Eager placeholders removed from renderer.js")
