# Update CHANGELOG.md
with open('CHANGELOG.md', 'r', encoding='utf-8') as f:
    content = f.read()

rule_addition = "- **Zero Hardcoding Policy**: Enforced strict rules in `AGENTS.md` and scrubbed all hardcoded credentials from the Admin dashboard. Admin credentials must now be loaded via `.env`."

if "Zero Hardcoding Policy" not in content:
    content = content.replace("### Changed", "### Changed\n" + rule_addition)

with open('CHANGELOG.md', 'w', encoding='utf-8') as f:
    f.write(content)
