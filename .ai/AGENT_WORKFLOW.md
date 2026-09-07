# AI AGENT WORKFLOW — MANDATORY

This repository is developed with AI coding agents.

Supported agents may include:
- Claude Code
- OpenAI Codex
- Google Antigravity
- GitHub Copilot
- Other AI coding agents

IMPORTANT:
AI conversation memory is NOT the source of truth.
The repository itself is the source of truth.

Before making ANY change, the agent MUST inspect the existing repository
state and relevant Git history.

============================================================
RULE 1 — NEVER BLINDLY MODIFY THE PROJECT
============================================================

Before modifying anything:
1. Read CLAUDE.md if using Claude.
2. Read AGENTS.md.
3. Read REQUIREMENTS.md.
4. Read ARCHITECTURE.md.
5. Read .ai/CURRENT_STATE.md.
6. Read .ai/PROJECT_MEMORY.md.
7. Read .ai/CHANGE_POLICY.md.
8. Read .ai/UI_UX_CONTRACT.md for UI changes.
9. Read relevant ADRs.
10. Inspect Git status.
11. Inspect recent Git history.
12. Inspect relevant previous commits.
13. Inspect the files being modified.
14. Understand why the existing implementation exists.

Never assume existing code is wrong simply because it can be improved.

============================================================
RULE 2 — PRESERVE EXISTING FUNCTIONALITY
============================================================

Existing functionality MUST NOT be removed unless the requirement
explicitly requests removal.

This includes:
- UI
- UX
- animations
- navigation
- API behavior
- authentication
- WebRTC behavior
- AI behavior
- keyboard shortcuts
- desktop behavior
- responsive behavior
- accessibility
- integrations
- error handling
- configuration
- existing workflows

If an existing feature is not mentioned in the new requirement:
PRESERVE IT.

============================================================
RULE 3 — NO UNAUTHORIZED DELETIONS
============================================================

Never delete:
- files
- directories
- components
- APIs
- database tables
- migrations
- tests
- UI screens
- CSS
- hooks
- utilities
- configuration
- scripts

unless:
A. The user explicitly requests deletion, OR
B. The feature is proven obsolete and the removal is documented.

Before deletion:
1. Identify consumers.
2. Search the repository.
3. Inspect Git history.
4. Explain why deletion is safe.
5. Create a migration/recovery plan.
6. Commit the change separately.

============================================================
RULE 4 — NEVER REWRITE WORKING SYSTEMS WITHOUT JUSTIFICATION
============================================================

Do not perform:
- giant rewrites
- mass file replacement
- mass renaming
- framework migration
- UI redesign
- database redesign
- architecture replacement

without first producing a migration plan.

Prefer:
small
incremental
reversible
tested
changes.

============================================================
RULE 5 — ALWAYS CREATE A RECOVERY POINT
============================================================

Before a significant change:
1. Ensure Git working tree state is understood.
2. Create a checkpoint commit OR ensure an existing clean commit exists.
3. Record the current commit SHA.
4. Record the intended change.
5. Record affected files.

Never begin a major migration with an unknown working tree.

============================================================
RULE 6 — WORK IN SMALL COMMITS
============================================================

Do not create one giant commit.

Prefer:
commit 1: architecture preparation
commit 2: domain changes
commit 3: API changes
commit 4: UI changes
commit 5: tests
commit 6: documentation

Each commit must represent one logical change.

============================================================
RULE 7 — TEST BEFORE AND AFTER
============================================================

Before changing code:
Run the relevant tests.

After changing code:
Run:
- tests
- type checking
- linting
- build
- relevant integration tests

If something was working before and is broken afterward:
STOP.
Do not continue building new functionality on top of the regression.

============================================================
RULE 8 — UI/UX IS SACRED
============================================================

Do not remove or redesign UI/UX unless explicitly requested.

Before UI changes:
Inspect:
- existing screenshots
- components
- styles
- design tokens
- routes
- navigation
- responsive behavior
- animations
- accessibility

Preserve existing visual behavior unless the requirement explicitly
changes it.

============================================================
RULE 9 — REQUIREMENT TRACEABILITY
============================================================

Every significant change must answer:
WHY is this change required?
Which requirement does it satisfy?
Which files are affected?
What existing behavior could be affected?
What tests prove it works?

============================================================
RULE 10 — UPDATE PROJECT MEMORY
============================================================

After significant work update:
.ai/CURRENT_STATE.md
.ai/PROJECT_MEMORY.md
.ai/CHANGELOG.md
.ai/MIGRATION_LOG.md

If an architectural decision was made:
Create/update an ADR.

============================================================
RULE 11 — DO NOT INVENT REQUIREMENTS
============================================================

If a requirement is ambiguous:
STOP and ask.

Do not invent:
- UI
- API behavior
- database schema
- business logic
- authentication rules
- user workflows

============================================================
RULE 12 — WHEN IN DOUBT, PRESERVE
============================================================

If uncertain whether something is intentional:
DO NOT DELETE IT.
Investigate Git history.
Ask the user if necessary.

============================================================
RULE 13 — NO FORCE DESTRUCTIVE GIT COMMANDS
============================================================

Do NOT execute:
git reset --hard
git clean -fd
git checkout -- .
git restore .
git push --force

unless the user explicitly authorizes it.
Never destroy uncommitted work.

============================================================
RULE 14 — FINAL CHANGE REPORT
============================================================

After every significant task report:
1. What changed
2. Why it changed
3. Files changed
4. Files added
5. Files deleted
6. Tests executed
7. Tests passed
8. Known risks
9. Remaining TODOs
10. Git commit SHA
