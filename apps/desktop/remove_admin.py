import re

path = 'src/components/views/CustomizeView.js'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the Admin Dashboard Section with empty string
admin_section_regex = r"\s*<!-- Admin Dashboard Section -->\s*<div class=\"settings-card\">\s*<div class=\"settings-card-title\"[^>]*>.*?</div>\s*<div class=\"form-row\">\s*<label class=\"form-label\">Manage Users and Settings</label>\s*<button class=\"upgrade-btn\"[^>]*>\s*Open Admin Panel\s*</button>\s*<div class=\"form-hint\"[^>]*>\s*Only accessible if your account has administrative privileges.\s*</div>\s*</div>\s*</div>"

content = re.sub(admin_section_regex, "", content, flags=re.DOTALL)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Removed Admin Dashboard from CustomizeView.js")
