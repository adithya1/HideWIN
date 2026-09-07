# ADR 001: Project Architecture

## Status
Accepted

## Context
Hide-WIN was originally a chaotic collection of scripts. We need a maintainable enterprise architecture.

## Decision
We will adopt a Clean Architecture pattern, separating the application into decoupled layers:
- `core/`: Configuration, exceptions, base models.
- `models/`: Database schemas.
- `repositories/`: Database interaction logic.
- `services/`: Business logic.
- `routers/`: FastAPI HTTP endpoints.

## Consequences
- Better testability.
- Clear separation of concerns.
- Slightly higher boilerplate overhead for simple CRUD.
