# HIDE-WIN DEVELOPMENT CONSTITUTION

## Version 1.0

This document defines the permanent engineering rules for the Hide-WIN project.

These rules apply to:
* Human developers
* Claude
* Codex
* Antigravity
* AI coding agents
* Future contributors
* Automated development tools

All contributors must follow this constitution.

====================================================
ARTICLE 1 — ARCHITECTURE FIRST
==============================
Before adding code:
1. Understand the existing architecture.
2. Locate the responsible module.
3. Determine whether similar functionality already exists.
4. Reuse or extend existing components when appropriate.
5. Do not create a new file without architectural justification.
A new file must have a clear responsibility.

====================================================
ARTICLE 2 — NO RANDOM FILES
===========================
Do not create files with development-action names such as:
add_*.py, check_*.py, clean_*.py, create_*.py, debug_*.py, diff_*.py, dummy_*.py, find_*.py, fix_*.py, patch_*.py, restore_*.py, search_*.py, update_*.py

A filename must describe what the module IS.
It must not describe what a developer DID.

BAD: fix_login.py
GOOD: authentication_service.py

====================================================
ARTICLE 3 — FIX THE ORIGINAL CODE
=================================
A bug fix must modify the module responsible for the functionality.
Never create a separate "fix" implementation when an existing implementation exists.

Process:
BUG ↓ REPRODUCE ↓ IDENTIFY ROOT CAUSE ↓ LOCATE RESPONSIBLE MODULE ↓ FIX IMPLEMENTATION ↓ ADD REGRESSION TEST ↓ RUN TESTS

====================================================
ARTICLE 4 — ONE RESPONSIBILITY
==============================
Every Package, Module, Class, and Function must have a clear responsibility.
Avoid God classes/modules. Avoid functions that perform multiple unrelated operations.

====================================================
ARTICLE 5 — REUSE BEFORE CREATE
===============================
Before creating a function, class, service, utility, or repository, search the existing project.
Do not duplicate existing functionality.

====================================================
ARTICLE 6 — FILE LOCATION RULE
==============================
Production code belongs in production packages (e.g. `services/`, `apps/`).
Tests belong in tests.
Documentation belongs in docs.
Operational scripts belong in scripts.
Temporary experiments must not be committed to production code.

====================================================
ARTICLE 7 — NAMING
==================
Names must describe responsibility.
Files: snake_case.py
Classes: PascalCase
Functions: snake_case()
Constants: UPPER_CASE

Avoid vague names like data, temp, new, final, fix, patch, test2, value, result.

====================================================
ARTICLE 8 — PEP 8
=================
Python code must follow PEP 8. Use automated formatting and linting. Code must be readable.

====================================================
ARTICLE 9 — DESIGN PRINCIPLES
=============================
Apply KISS, DRY, SOLID, and Separation of Concerns. Do not overengineer.

====================================================
ARTICLE 10 — DESIGN PATTERNS
============================
Use design patterns only when necessary. A design pattern must solve a real architectural problem.

====================================================
ARTICLE 11 — DOCUMENTATION
==========================
Important modules require documentation. Public classes and functions require docstrings.
Comments should explain WHY. Code should explain WHAT.

====================================================
ARTICLE 12 — TEST FIRST MINDSET
===============================
Every feature must have appropriate tests (Positive, Negative, Edge cases, Regression).

====================================================
ARTICLE 13 — BUG FIX TESTING
============================
Every bug fix should include a regression test when practical. The regression test must reproduce the original failure.

====================================================
ARTICLE 14 — NO BREAKING PREVIOUS FEATURES
==========================================
Before completing a change, run affected tests, regression tests, integration tests, and the complete test suite.

====================================================
ARTICLE 15 — AI DEVELOPMENT
===========================
AI coding tools must not blindly generate files.
Before coding, the AI must inspect project structure, understand existing modules, search for existing functionality, and identify dependencies/tests/documentation.

====================================================
ARTICLE 16 — AI MUST NOT CREATE CHEAP FIXES
===========================================
AI tools must not solve problems by creating fix_xxx.py, patch_xxx.py, new_xxx.py, etc.
The AI must modify the correct responsible module.

====================================================
ARTICLE 17 — FEATURE DEVELOPMENT PROCESS
========================================
UNDERSTAND ↓ DESIGN ↓ LOCATE MODULE ↓ IMPLEMENT ↓ UNIT TEST ↓ NEGATIVE TEST ↓ REGRESSION TEST ↓ DOCUMENTATION ↓ RELEASE NOTES ↓ COMMIT

====================================================
ARTICLE 18 — REFACTORING PROCESS
================================
Refactoring must preserve behavior. Understand behavior, verify tests, make small changes, run tests frequently.

====================================================
ARTICLE 19 — GIT COMMIT QUALITY
===============================
Every commit must explain WHAT changed (e.g., `feat(auth): add token expiration validation`). Avoid meaningless commits.

====================================================
ARTICLE 20 — DOCUMENTATION IS CODE
==================================
Documentation is part of the project. A feature is incomplete when documentation is outdated.

====================================================
ARTICLE 21 — RELEASE NOTES
==========================
Every meaningful release must explain: What is new? What changed? What was fixed? What was tested? Was regression testing performed?

====================================================
ARTICLE 22 — DEFINITION OF DONE
===============================
A task is complete only when: CODE + TESTS + NEGATIVE TESTS + REGRESSION TESTS + DOCUMENTATION + RELEASE NOTES + VALIDATION are complete.

====================================================
ARTICLE 23 & 24 — BEFORE COMMITTING / PUSHING
=============================================
Verify no random files, no secrets committed, meaningful commit messages, and all tests pass.

====================================================
FINAL PRINCIPLE
===============
The Hide-WIN repository must be understandable by a developer who has never seen the project before.
