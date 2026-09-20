import re

# Update AGENTS.md
with open('../AGENTS.md', 'r', encoding='utf-8') as f:
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

with open('../AGENTS.md', 'w', encoding='utf-8') as f:
    f.write(content)

# Create .env.example
with open('.env.example', 'w', encoding='utf-8') as f:
    f.write("ADMIN_EMAIL=admin@yourdomain.com\nADMIN_PASSWORD=your_secure_password\n")

