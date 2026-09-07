# CURRENT MODULE INVENTORY

| Module | Responsibility | Stack | Deployment |
|--------|----------------|-------|------------|
| `Hide-Win-Master` | Desktop App overlay | Electron, LitElement | Executable (Windows/macOS) |
| `Hide-Win-Web` | Guest/Admin Web UI | React, Vite | Served via Cloud Relay or CDN |
| `hidewin-fastapi` | Core Business API | Python, FastAPI, SQLite | Docker Container |
| `hidewin-cloud-relay` | WebRTC Signaling | Node.js, Express, ws | Docker Container |
| `whisper-server` | Audio Transcription | Python, WebSockets, Whisper | Docker Container |
| `scripts` | Maintenance/Patching | Python/JS | Local Utility |
