import json
import re

with open('recovered_shared.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# The content could be in tool_calls, or output, etc. depending on what step it was.
content_str = json.dumps(data)

# Let's try to extract the literal string block for sharedPageStyles
match = re.search(r'export const unifiedPageStyles = css`(.*?)`;', content_str, re.DOTALL | re.IGNORECASE)
if match:
    # Handle json escape sequences
    extracted = match.group(1).encode('utf-8').decode('unicode_escape')
    with open('src/components/views/sharedPageStyles.js', 'w', encoding='utf-8') as out:
        out.write("import { css } from '../../assets/lit-core-2.7.4.min.js';\n\nexport const unifiedPageStyles = css`\n" + extracted + "\n`;")
    print("Recovered sharedPageStyles.js!")
else:
    print("Could not regex extract it.")
