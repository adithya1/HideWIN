# Changelog

## [Unreleased] - 2026-09-19
### Added
- **Global Config Manager**: Introduced `src/utils/configManager.js` to completely decouple hardcoded `localhost` and `huddlemate` URLs across the app.
- **Admin Deployment Settings**: Added a new Network & Deployment Settings card in the Admin dashboard to dynamically configure Web App Domain, Backend API Domain, and Cloud VPC settings (AWS, DigitalOcean, GoDaddy).
- **Global Path Manager**: Introduced `src/utils/pathManager.js` leveraging Node's `path` module to guarantee 100% robust, OS-agnostic file path resolution across the main and renderer processes.

### Changed
- **Zero Hardcoding Policy**: Enforced strict rules in `AGENTS.md` and scrubbed all hardcoded credentials from the Admin dashboard. Admin credentials must now be loaded via `.env`.
- Refactored `AuthView`, `MainView`, `InviteView`, `ScheduleMeetingView`, `authCheck`, `cloud`, and `ai_proxy_client` to dynamically load URLs from the `configManager`.
- Replaced hardcoded `./assets/images` string literals with `pathManager.getAssetPath()`.
