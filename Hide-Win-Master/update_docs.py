import datetime

date_str = datetime.datetime.now().strftime("%Y-%m-%d")

# Update .ai/CHANGELOG.md
with open('../.ai/CHANGELOG.md', 'a', encoding='utf-8') as f:
    f.write(f"\n## {date_str}\n\n")
    f.write("### UI\n")
    f.write("- Introduced a 30/70 split native login window on application startup.\n")
    f.write("- Implemented 'Pill Mode' for a transparent, stealthy floating UI after successful authentication.\n\n")
    f.write("### Security\n")
    f.write("- Implemented OAuth2 PKCE (Proof Key for Code Exchange) flow for desktop application login.\n")
    f.write("- Replaced basic SSO WebView integration with secure default browser redirect to `https://app.huddlemate.ai/signin`.\n")
    f.write("- Implemented deep link `huddlemate://callback` intercept and background token exchange.\n")

# Update CHANGELOG.md
with open('../CHANGELOG.md', 'a', encoding='utf-8') as f:
    f.write(f"\n## [{date_str}] - Authentication UI & Security Revamp\n")
    f.write("### Added\n")
    f.write("- Enterprise-grade OAuth2 PKCE authentication flow for secure desktop logins.\n")
    f.write("- Support for handling `huddlemate://callback` deep links to finalize authentication.\n")
    f.write("- 30/70 split native login window (30% form, 70% high-quality background).\n")
    f.write("### Changed\n")
    f.write("- The app now transitions to a transparent, stealthy floating 'Pill Mode' upon successful login.\n")
    f.write("- SSO buttons now securely redirect to the default system browser instead of an in-app frame.\n")

# Update RELEASE_NOTES.md
with open('../RELEASE_NOTES.md', 'a', encoding='utf-8') as f:
    f.write(f"\n## Version 0.2.0 (Auth UI & PKCE Revamp)\n\n")
    f.write("?? **What is new?**\n")
    f.write("We completely redesigned the application startup experience. You will now be greeted by a beautiful, professional full-window login screen featuring a sleek 30/70 split layout.\n\n")
    f.write("?? **Security Upgrades!**\n")
    f.write("Under the hood, we upgraded the authentication system to use **OAuth2 PKCE** (Proof Key for Code Exchange) - the industry gold standard for securing desktop applications. Login flows now securely hand off to your default web browser and securely pass tokens back to the app without exposing passwords to the local client.\n\n")
    f.write("? **Stealth UI Mode**\n")
    f.write("Once logged in, the large window vanishes and the app transforms into a fully transparent, stealthy floating 'Pill' on your desktop, staying entirely out of your way until you need it.\n")

