import re

# Update AGENTS.md
with open('AGENTS.md', 'r', encoding='utf-8') as f:
    content = f.read()

rule_addition = """
## Zero Hardcoding Policy
- Do not hardcode any links, paths, file names, API domains, cloud environments, AI models, or credentials anywhere in the source code.
- Always use `configManager.js` for domains, URLs, and network endpoints.
- Always use `pathManager.js` for file path resolution.
- Exception: Admin login credentials (like `ADMIN_EMAIL` and `ADMIN_PASSWORD`) may be provided via a `.env` file, but must NEVER be hardcoded in any `.js`, `.html`, or config files.
"""

if "Zero Hardcoding Policy" not in content:
    content += "\n" + rule_addition

with open('AGENTS.md', 'w', encoding='utf-8') as f:
    f.write(content)

# Update admin.html
with open('src/admin.html', 'r', encoding='utf-8') as f:
    html = f.read()

html = re.sub(r'<tr><td><span class="status status-err">ADMIN</span></td><td>admin@hidewin\.com</td><td style="font-family:var\(--mono\);font-size:12px">adminpassword123</td></tr>',
             r'<tr><td><span class="status status-err">ADMIN</span></td><td>[Loaded via .env]</td><td style="font-family:var(--mono);font-size:12px">***</td></tr>', html)
html = re.sub(r'<tr><td><span class="status status-warn">VENDOR</span></td><td>StarkIndustries@vendor\.com</td><td style="font-family:var\(--mono\);font-size:12px">vendorpassword123</td></tr>',
             r'<tr><td><span class="status status-warn">VENDOR</span></td><td>[From DB]</td><td style="font-family:var(--mono);font-size:12px">***</td></tr>', html)
html = re.sub(r'<tr><td><span class="status status-ok">USER</span></td><td>tony\.stark@starkindustries\.com</td><td style="font-family:var\(--mono\);font-size:12px">password123</td></tr>',
             r'<tr><td><span class="status status-ok">USER</span></td><td>[From DB]</td><td style="font-family:var(--mono);font-size:12px">***</td></tr>', html)

html = re.sub(r'<tr><td>admin@hidewin\.com</td>', r'<tr><td>[Admin via .env]</td>', html)

with open('src/admin.html', 'w', encoding='utf-8') as f:
    f.write(html)
