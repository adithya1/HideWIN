# UI/UX CONTRACT

The existing UI/UX is considered production functionality.

AI agents MUST preserve existing UI/UX unless the user explicitly
requests a UI/UX change.

Before modifying UI:
1. Identify the affected screens.
2. Identify affected components.
3. Identify existing routes.
4. Identify responsive behavior.
5. Identify design tokens.
6. Identify animations.
7. Identify accessibility behavior.
8. Inspect Git history.

Never replace an existing page with a simplified placeholder.

Never remove:
- navigation
- buttons
- dialogs
- forms
- keyboard shortcuts
- animations
- loading states
- error states
- responsive layouts

without explicit authorization.

If a backend refactor requires frontend changes,
preserve the existing visual and interaction behavior.

A technical refactor is NOT permission to redesign the UI.
