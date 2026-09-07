# HIDE-WIN PROJECT CONSTITUTION

1. Existing functionality is preserved by default.
2. Existing UI/UX is production functionality.
3. No destructive change without explicit authorization.
4. No major rewrite without a migration plan.
5. No AI agent may rely on conversation memory.
6. Git history is part of the project's permanent memory.
7. Requirements are the authority for intended behavior.
8. ADRs are the authority for architectural decisions.
9. CURRENT_STATE.md represents the current implementation state.
10. PROJECT_MEMORY.md represents persistent project knowledge.
11. Every major change must be reversible.
12. Every major change must have a Git checkpoint.
13. AI agents work on branches, never directly on main.
14. Tests must pass before merging.
15. Performance claims require benchmarks.
16. Security claims require security testing.
17. Scalability claims require load testing.
18. WebRTC capacity claims require actual WebRTC load tests.
19. AI latency claims require measured TTFT and end-to-end latency.
20. No unrelated refactoring during feature work.
21. No opportunistic UI redesign.
22. No silent deletion.
23. No destructive Git operations without authorization.
24. When uncertain, preserve existing behavior and ask.
25. The goal is a production-grade, maintainable, scalable system,
not merely code that compiles.
