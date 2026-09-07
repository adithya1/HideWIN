# API INVENTORY

## hidewin-fastapi
- **Endpoints**: Various CRUD operations for meetings, auth, and AI routing.
- **Complexity**: Many endpoints currently exhibit O(1) DB lookups, but lack proper pagination, making list endpoints theoretically O(N).
- **Bottlenecks**: Synchronous database calls in async routes block the event loop.

## hidewin-cloud-relay
- **WebSockets**: Handles meeting joins, ICE candidate exchange, and SDP offers/answers.
- **Complexity**: O(1) memory lookup per message, but bounded by single-process Node.js memory limits.
- **Bottlenecks**: No Redis backplane; messages cannot be routed across multiple relay instances.
