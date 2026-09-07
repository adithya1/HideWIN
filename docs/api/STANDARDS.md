# API DOCUMENTATION STANDARDS

## Overview
To ensure seamless integration across the Web, Desktop, and potential third-party clients, Hide-WIN strictly enforces documentation as code. API contracts are the ultimate source of truth.

## 1. REST APIs (OpenAPI / Swagger)
- **Framework Integration**: FastAPI automatically generates the `openapi.json`.
- **Enforcement**:
  - Every endpoint MUST have `response_model` defined.
  - Every parameter MUST have validation (e.g., `Query(..., min_length=3)`).
  - Every endpoint MUST specify `tags`, `summary`, and potential `responses` (e.g., `404`, `429`, `500`) with example schemas.
- **Access**: The live Swagger UI is accessible at `/api/docs` (disabled in production).

## 2. WebSocket Channels (AsyncAPI)
Because WebSockets do not have native self-documenting frameworks like FastAPI, we maintain an AsyncAPI specification file.
- **Location**: `docs/api/asyncapi.yaml`.
- **Requirements**:
  - Every Pub/Sub event (e.g., `join_room`, `ai_chunk`, `server_shutdown`) must be defined with its JSON schema.
  - The connection lifecycle, authentication headers (JWT in first payload), and ping/pong heartbeat intervals must be documented.

## 3. Versioning Policy
- **URL Versioning**: All REST endpoints are prefixed with `/api/v1/`.
- **Breaking Changes**: Changing a response payload shape, making an optional parameter required, or altering status codes constitutes a breaking change.
- **Process**: A breaking change MUST be introduced in `/api/v2/`. The `v1` endpoint is marked as `@deprecated` in the OpenAPI schema but remains fully functional until the scheduled sunset date.

## 4. Integration Guides
For complex orchestrations (like the 5-step WebRTC ICE negotiation), raw OpenAPI schemas are insufficient. Sequence diagrams (Mermaid.js) and Markdown tutorials MUST be placed in `docs/api/guides/` before PRs are merged.
