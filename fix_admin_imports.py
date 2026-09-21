import re

file_path = "services/web/src/pages/Admin.jsx"
with open(file_path, "r", encoding="utf-8") as f:
    text = f.read()

# Add User and MoreVertical to the lucide-react import
import_pattern = r'import \{([^}]+)\} from "lucide-react";'

def replacer(match):
    imports = match.group(1)
    if "User," not in imports and " User " not in imports:
        imports += ", User, MoreVertical"
    return f'import {{{imports}}} from "lucide-react";'

text = re.sub(import_pattern, replacer, text)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(text)

print("Fixed imports in Admin.jsx!")
