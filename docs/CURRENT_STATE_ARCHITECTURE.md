# CURRENT STATE ARCHITECTURE

## High-Level Overview
Hide-WIN currently operates as a loosely coupled set of services:
- **Hide-Win-Master**: Electron desktop client handling UI overlay and screen capture.
- **Hide-Win-Web**: Web client for users/admins.
- **hidewin-fastapi**: Python backend providing core APIs and currently routing AI requests.
- **whisper-server**: Python WebSocket service for local/dedicated audio transcription.

## Architecture Violations & Gaps
1. **Persistence**: `hidewin-fastapi` relies on local SQLite. It lacks a robust ORM layer (like SQLAlchemy 2.0) and connection pooling.
3. **AI Vendor Lock-in**: Calls to Gemini/Claude are tightly coupled to the application logic. No abstract `AIProvider` exists.
4. **Meeting signaling**: Retired from the active product; prior implementation is preserved under `deleted/retired-realtime-service/`.
