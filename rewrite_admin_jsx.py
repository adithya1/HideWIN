import re

with open("services/web/src/pages/Admin.jsx", "r", encoding="utf-8") as f:
    text = f.read()

if "import EmailTemplates from" not in text:
    text = text.replace("import { useNavigate } from 'react-router-dom';", "import { useNavigate } from 'react-router-dom';\nimport EmailTemplates from './EmailTemplates';")

# Find the old email templates block
start_marker = "{/* EMAIL TEMPLATES */}"
end_marker = "{/* BRANDING & LOGOS */}"

start_idx = text.find(start_marker)
end_idx = text.find(end_marker)

if start_idx != -1 and end_idx != -1:
    new_block = """{/* EMAIL TEMPLATES */}
                {activeSettingsTab === 'email_templates' && (
                    <EmailTemplates />
                )}
                
                """
    
    # We replace from start_marker up to end_marker
    new_text = text[:start_idx] + new_block + text[end_idx:]
    
    with open("services/web/src/pages/Admin.jsx", "w", encoding="utf-8") as f:
        f.write(new_text)
    print("Replaced email templates block in Admin.jsx")
else:
    print("Could not find markers in Admin.jsx")
