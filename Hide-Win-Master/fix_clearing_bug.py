import re

filepath = r"c:\Users\akula\Downloads\Hide-WIN\Hide-Win-Master\src\components\app\HideWinApp.js"
with open(filepath, "r", encoding="utf-8") as f:
    content = f.read()

target = r"""        // If the last card is an in-flight placeholder for this question, update it
        if \(
            this\.responses\.length > 0 &&
            typeof response === 'object' &&
            response !== null &&
            \(this\._awaitingNewResponse || String\(this\.responses\[this\.responses\.length - 1\]\?\.answer || ''\)\.includes\('Generating response'\)\)
        \) \{
            this\.responses = \[\.\.\.this\.responses\.slice\(0, -1\), response\];
        \} else \{
            this\.responses = \[\.\.\.this\.responses, response\];
        \}"""

replacement = r"""        // If the last card is an in-flight placeholder for this question, update it
        if (
            this.responses.length > 0 &&
            typeof response === 'object' &&
            response !== null &&
            String(this.responses[this.responses.length - 1]?.answer || '').includes('Generating response') &&
            this.responses[this.responses.length - 1]?.question === response.question
        ) {
            this.responses = [...this.responses.slice(0, -1), response];
        } else {
            this.responses = [...this.responses, response];
        }"""

content = re.sub(target, replacement, content)

with open(filepath, "w", encoding="utf-8") as f:
    f.write(content)
print("HideWinApp.js updated to stop clearing previous questions")
