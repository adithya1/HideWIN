import re

path_profile = 'src/components/views/AICustomizeView.js'
with open(path_profile, 'r', encoding='utf-8') as f:
    content = f.read()

# Add color-scheme: inherit; to .form-control
form_control_old = r'\.form-control\s*\{'
form_control_new = r'.form-control {\n                color-scheme: inherit;'
content = re.sub(form_control_old, form_control_new, content)

with open(path_profile, 'w', encoding='utf-8') as f:
    f.write(content)

print("Added color-scheme inherit to AICustomizeView modal")
