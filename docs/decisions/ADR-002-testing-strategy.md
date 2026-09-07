# ADR 002: Testing Strategy

## Status
Accepted

## Context
Features were being deployed without adequate verification.

## Decision
We mandate a strict testing pyramid enforced by GitHub Actions:
- Unit Tests (`tests/unit`)
- Negative Tests (`tests/negative`)
- Regression Tests (`tests/regression`)

## Consequences
- Slower development initially, but higher confidence.
- PRs will be blocked if test coverage drops or if regression tests fail.
