# Release Notes

## Version 0.1.0

🌟 **What is new?**
We added user login and the core backend architecture. Users can now securely log in to the application and administrators can manage settings.

🔧 **What changed?**
We improved how the application validates user data and structured a brand new strict testing pipeline to prevent bugs.

🧪 **What did we test?**
✓ Correct username and password
✓ Wrong password
✓ Empty username
✓ Expired session tokens
✓ Invalid login requests

🛡️ **Did we check old features?**
Yes. We ran regression tests to make sure existing functionality still works perfectly.

🐛 **What did we fix?**
Fixed an issue where invalid configurations could crash the server silently instead of providing a clear error message.

## Version 0.2.0 (Auth UI & PKCE Revamp)

?? **What is new?**
We completely redesigned the application startup experience. You will now be greeted by a beautiful, professional full-window login screen featuring a sleek 30/70 split layout.

?? **Security Upgrades!**
Under the hood, we upgraded the authentication system to use **OAuth2 PKCE** (Proof Key for Code Exchange) - the industry gold standard for securing desktop applications. Login flows now securely hand off to your default web browser and securely pass tokens back to the app without exposing passwords to the local client.

? **Stealth UI Mode**
Once logged in, the large window vanishes and the app transforms into a fully transparent, stealthy floating 'Pill' on your desktop, staying entirely out of your way until you need it.
