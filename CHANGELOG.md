# Changelog\n\nAll notable changes to this project will be documented in this file.\n
## [2026-09-19] - Authentication UI & Security Revamp
### Added
- Enterprise-grade OAuth2 PKCE authentication flow for secure desktop logins.
- Support for handling `huddlemate://callback` deep links to finalize authentication.
- 30/70 split native login window (30% form, 70% high-quality background).
### Changed
- The app now transitions to a transparent, stealthy floating 'Pill Mode' upon successful login.
- SSO buttons now securely redirect to the default system browser instead of an in-app frame.
