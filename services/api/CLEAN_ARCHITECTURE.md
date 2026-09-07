# Backend Clean Architecture

## Layers
1. **Domain**: Entities and interface definitions. Pure Python. NO frameworks.
2. **Application**: Use cases/interactors. Coordinates domain objects.
3. **Infrastructure**: Concrete implementations (SQLAlchemy, Redis, AWS SDKs).
4. **API (Presentation)**: FastAPI controllers, routing, and HTTP serialization.

## Rules
- Controllers MUST NOT execute SQL (no `db.query()` in routes).
- Domain MUST NOT depend on FastAPI or SQLAlchemy.
- Dependencies flow INWARD.
