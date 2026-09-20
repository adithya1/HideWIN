# Release Notes

## Release Notes - 2026-09-19

### Architecture Revamp: Dynamic Deployment & Decoupling
We have completed a massive structural refactor to prepare HideWin for production deployment on AWS, DigitalOcean, or GoDaddy VPCs.
- **Dynamic Config Engine:** All tightly coupled APIs and URLs (`localhost:5173`, `localhost:8000`, `huddlemate.ai`) have been extracted into a central `configManager.js`.
- **Admin Deployment Dashboard:** You can now configure the target production domains, IP addresses, and Server Usernames directly from the `admin.html` dashboard.
- **OS-Agnostic Paths:** Replaced all hardcoded string file paths with a unified `pathManager.js` powered by Node's `path` module.
