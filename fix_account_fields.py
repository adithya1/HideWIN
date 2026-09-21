import re

file_path = "services/web/src/pages/Account.jsx"
with open(file_path, "r", encoding="utf-8") as f:
    text = f.read()

# Pattern to remove the First Name and Last Name divs
pattern = r'<div style=\{\{ display: "flex", gap: "24px", marginBottom: "24px" \}\}>.*?</div>\s*</div>'

new_text = re.sub(pattern, '', text, flags=re.DOTALL)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(new_text)

print("Removed first name and last name fields from Account.jsx!")
