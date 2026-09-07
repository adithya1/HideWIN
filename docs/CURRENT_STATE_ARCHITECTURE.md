# CURRENT STATE ARCHITECTURE

## High-Level Overview
Hide-WIN currently operates as a loosely coupled set of services:
- **Hide-Win-Master**: Electron desktop client handling UI overlay and screen capture.
- **Hide-Win-Web**: Web client for guests/admin.
- **hidewin-fastapi**: Python backend providing core APIs and currently routing AI requests.
- **hidewin-cloud-relay**: Node.js service managing WebRTC signaling and session state.
- **whisper-server**: Python WebSocket service for local/dedicated audio transcription.

## Architecture Violations & Gaps
1. **State Management**: `hidewin-cloud-relay` stores WebRTC signaling sessions in local memory. This prevents horizontal scaling.
2. **Persistence**: `hidewin-fastapi` relies on local SQLite. It lacks a robust ORM layer (like SQLAlchemy 2.0) and connection pooling.
3. **AI Vendor Lock-in**: Calls to Gemini/Claude are tightly coupled to the application logic. No abstract `AIProvider` exists.
4. **Signaling & Media**: STUN/TURN are not provisioned for production loads.
