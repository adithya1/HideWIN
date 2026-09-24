# API INVENTORY

## hidewin-fastapi
- **Endpoints**: Authentication, user/admin operations, billing, integrations, and AI routing. Meeting CRUD and guest invitation routes are retired.
- **Complexity**: Many endpoints currently exhibit O(1) DB lookups, but lack proper pagination, making list endpoints theoretically O(N).
- **Bottlenecks**: Synchronous database calls in async routes block the event loop.

- **Retired API groups**: Meeting CRUD, guest join, and meeting calendar webhook routes have been removed from the active API.
