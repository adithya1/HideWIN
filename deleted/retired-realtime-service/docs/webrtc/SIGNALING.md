# DISTRIBUTED SIGNALING (Redis Pub/Sub)

## Session State
Instead of `global.meetings = {}`, session presence is maintained in Redis:
- **Keys**: `meeting:{id}:participants` (Redis SET of User IDs)
- **Presence TTL**: 30 seconds, maintained by client heartbeat.

## Signaling Message Flow
When User A sends an SDP Offer to User B:
1. User A sends `{"type": "offer", "target": "User B", "sdp": "..."}` via WebSocket to Node 1.
2. Node 1 publishes payload to Redis channel `meeting:{id}:signals`.
3. Node 2 (which holds User B's connection) receives the pub/sub event.
4. Node 2 routes the SDP offer to User B via WebSocket.

## Reconnection
If a WebSocket drops, the client reconnects with its JWT and resumes the session. The Redis presence TTL prevents ghost users.
