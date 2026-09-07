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
