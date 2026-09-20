# CHANGELOG

## 2026-09-06

### Architecture
- Established AI Agent Governance System.
- Created monorepo structure.

### UI
- Restored original desktop UI from 12:30 PM state.

### Backend
- Containerized Whisper server.

### Database
- No schema changes.

### WebRTC
- No behavior changes.

### Breaking Changes
- None.

### Migration
- Baseline established.

## 2026-09-19

### UI
- Introduced a 30/70 split native login window on application startup.
- Implemented 'Pill Mode' for a transparent, stealthy floating UI after successful authentication.

### Security
- Implemented OAuth2 PKCE (Proof Key for Code Exchange) flow for desktop application login.
- Replaced basic SSO WebView integration with secure default browser redirect to `https://app.huddlemate.ai/signin`.
- Implemented deep link `huddlemate://callback` intercept and background token exchange.
