import re

path = 'src/components/views/CustomizeView.js'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the Admin Dashboard Section with empty string using a simpler regex
admin_section_regex = r"\s*<!-- Admin Dashboard Section -->\s*<div class=\"settings-card\">\s*<div class=\"settings-card-title\"[^>]*>.*?Admin Dashboard</div>.*?Open Admin Panel\s*</button>.*?</div>\s*</div>\s*</div>"

content = re.sub(admin_section_regex, "", content, flags=re.DOTALL)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Removed Admin Dashboard from CustomizeView.js via updated regex")
