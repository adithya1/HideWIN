# Hide-WIN Comprehensive Test Plan

## Overview
This test plan covers the critical paths for Hide-WIN, focusing on the new features: Mode categorization, prompt budget generation, profile usage, stealth window mechanics, and storage functionality.

## 1. Unit Tests (White-box)

### Prompts Module (\`src/utils/prompts.js\`)
*   **[P1] PROMPT-01 (Positive):** \`getSystemPrompt\` with \`modeCategory='mcq'\` returns an ultra-short concise prompt structure.
*   **[P1] PROMPT-02 (Positive):** \`getSystemPrompt\` with \`modeCategory='coding'\` returns a prompt containing APPROACH, CODE, and HOW IT WORKS sections.
*   **[P1] PROMPT-03 (Positive):** \`getSystemPrompt\` with \`modeCategory='oral'\` returns a spoken-style prompt format.
*   **[P2] PROMPT-04 (Positive):** \`getSystemPrompt\` with empty/no mode falls back to profile keyword matching (e.g., 'interview' gives interview prompt).
*   **[P1] PROMPT-05 (Positive):** \`getSystemPrompt\` with \`modeCategory='mcq'\` AND a \`customPrompt\` correctly includes the candidate profile context string.
*   **[Min] PROMPT-06 (Negative):** \`getSystemPrompt\` with an unknown modeCategory falls back gracefully to 'optional'.
*   **[Min] PROMPT-07 (Edge):** \`getSystemPrompt\` with null profile and empty modeCategory falls back to 'optional'.
*   **[P1] PROMPT-08 (Positive):** \`getTokenBudget\` correctly returns 256 for 'mcq'.
*   **[P1] PROMPT-09 (Positive):** \`getTokenBudget\` correctly returns 2048 for 'coding'.
*   **[P1] PROMPT-10 (Positive):** \`getTokenBudget\` correctly returns 768 for 'oral'.
*   **[Min] PROMPT-11 (Negative):** \`getTokenBudget\` returns 1024 (default) for an unknown mode.
*   **[P2] PROMPT-12 (Positive):** \`getTokenBudget\` with a profile name containing 'interview' (and no mode) returns 1500.
*   **[P2] PROMPT-13 (Structural):** \`modeCategoryPrompts\` object contains 'mcq', 'coding', and 'oral'.
*   **[P2] PROMPT-14 (Structural):** \`profilePrompts\` object contains 'optional' and 'interview'.

### Window Behaviors Module (\`src/utils/window.js\`)
*   **[P1] WIN-01 (Positive):** \`getDefaultKeybinds\` returns an object including the \`toggleClickThrough\` key.
*   **[P1] WIN-02 (Positive):** \`getDefaultKeybinds\` returns 'Ctrl+M' when \`process.platform\` is 'win32'.
*   **[P1] WIN-03 (Positive):** \`getDefaultKeybinds\` returns 'Cmd+M' when \`process.platform\` is 'darwin'.
*   **[P2] WIN-04 (Positive):** \`getDefaultKeybinds\` contains all required keys (moveUp, moveDown, toggleVisibility, toggleMouseVisibility, nextStep).
*   **[Min] WIN-05 (Boundary):** \`getDefaultKeybinds\` does not return undefined for any value.
*   **[Min] WIN-06 (Boundary):** All shortcut values returned are non-empty strings.

### Storage Module (\`src/storage.js\`)
*   **[P1] STOR-01 (Positive):** \`getConfig\` returns an object with \`mainWindowWidth\` and \`mainWindowHeight\`.
*   **[P1] STOR-02 (Boundary):** \`getConfig\` returns numeric width >= 400 and height >= 300.
*   **[P2] STOR-03 (Positive/Negative):** \`getKeybinds\` returns null or a valid object, never throws.
*   **[P1] STOR-04 (Positive):** \`initializeStorage\` executes without throwing an error.
*   **[P2] STOR-05 (Positive):** \`getProfiles\` returns an array.
*   **[P2] STOR-06 (Boundary):** Config with missing keys is patched with valid defaults upon retrieval.

## 2. Integration / E2E Tests (Black-box & UI/UX)

*(Note: These would require Playwright for Electron; manual steps provided below for standard QA testing).*

*   **[P1] UI-01 (Positive):** On app startup, the Mode dropdown is visible and defaults to 'Select Mode (Optional)'.
*   **[P1] UI-02 (Positive):** Selecting 'MCQ / Exam Scan' mode updates the state, and clicking 'Start Session' initializes a session without error.
*   **[P1] UI-03 (Positive):** Ending a session via the main window prompts a confirmation dialog ('Are you sure you want to close the app and end the session?').
*   **[P2] UI-04 (Positive):** Selecting a Profile updates the session's system prompt context.
*   **[Mid] UI-05 (Negative):** Clicking 'Start Session' while in 'Waiting for Mode' state correctly prompts the user to select a mode.
*   **[P1] E2E-01 (Regression):** Toggling 'Stealth Mode' (Ctrl+Alt+M) successfully ignores mouse events without throwing \`stopStealthMode is not defined\`.
*   **[P1] E2E-02 (Regression):** Ending a session does *not* maximize the main window inappropriately.
