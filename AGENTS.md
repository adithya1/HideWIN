IMPORTANT AI MEMORY POLICY

Do not rely on previous chat sessions.
Do not assume that information from a previous conversation still exists.
The repository is the persistent memory.

Before making decisions, inspect:
- requirements
- architecture
- ADRs
- project memory
- current state
- changelog
- migration log
- Git history

If context is missing, reconstruct it from the repository.
Never guess historical intent.


## Zero Hardcoding Policy
- Do not hardcode any links, paths, file names, API domains, cloud environments, AI models, or credentials anywhere in the source code.
- Always use `configManager.js` for domains, URLs, and network endpoints.
- Always use `pathManager.js` for file path resolution.
- Exception: Admin login credentials (like `ADMIN_EMAIL` and `ADMIN_PASSWORD`) may be provided via a `.env` file, but must NEVER be hardcoded in any `.js`, `.html`, or config files.


## Branding Policy
- NEVER use the name "HuddleMate" in the UI. The product is strictly named "HideWin".
- Logos and branding must be fetched dynamically from the Admin settings API (`/auth/branding`), not hardcoded as text or static images.
- Always use horizontal tabs for internal page navigation, not nested vertical sidebars.
- Ensure UI matches "ultra-posh" real-world SaaS standards (smooth animations, proper alignment, loading states on buttons).
