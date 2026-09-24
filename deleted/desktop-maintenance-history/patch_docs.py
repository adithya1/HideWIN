import datetime
date_str = datetime.datetime.now().strftime("%Y-%m-%d")

# CHANGELOG.md
changelog_addition = f"""
## [Unreleased] - {date_str}
### Added
- **Global Config Manager**: Introduced `src/utils/configManager.js` to completely decouple hardcoded `localhost` and `huddlemate` URLs across the app.
- **Admin Deployment Settings**: Added a new Network & Deployment Settings card in the Admin dashboard to dynamically configure Web App Domain, Backend API Domain, and Cloud VPC settings (AWS, DigitalOcean, GoDaddy).
- **Global Path Manager**: Introduced `src/utils/pathManager.js` leveraging Node's `path` module to guarantee 100% robust, OS-agnostic file path resolution across the main and renderer processes.

### Changed
- Refactored `AuthView`, `MainView`, `InviteView`, `ScheduleMeetingView`, `authCheck`, `cloud`, and `ai_proxy_client` to dynamically load URLs from the `configManager`.
- Replaced hardcoded `./assets/images` string literals with `pathManager.getAssetPath()`.
"""

with open('CHANGELOG.md', 'r', encoding='utf-8') as f:
    content = f.read()
if "## [Unreleased]" in content:
    content = content.replace("## [Unreleased]", changelog_addition)
else:
    content = changelog_addition + "\n" + content
with open('CHANGELOG.md', 'w', encoding='utf-8') as f:
    f.write(content)

# RELEASE_NOTES.md
release_addition = f"""
## Release Notes - {date_str}

### Architecture Revamp: Dynamic Deployment & Decoupling
We have completed a massive structural refactor to prepare HideWin for production deployment on AWS, DigitalOcean, or GoDaddy VPCs.
- **Dynamic Config Engine:** All tightly coupled APIs and URLs (`localhost:5173`, `localhost:8000`, `huddlemate.ai`) have been extracted into a central `configManager.js`.
- **Admin Deployment Dashboard:** You can now configure the target production domains, IP addresses, and Server Usernames directly from the `admin.html` dashboard.
- **OS-Agnostic Paths:** Replaced all hardcoded string file paths with a unified `pathManager.js` powered by Node's `path` module.
"""

with open('RELEASE_NOTES.md', 'r', encoding='utf-8') as f:
    content = f.read()
content = release_addition + "\n" + content
with open('RELEASE_NOTES.md', 'w', encoding='utf-8') as f:
    f.write(content)
