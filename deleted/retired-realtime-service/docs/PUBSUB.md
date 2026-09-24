# REALTIME PUBSUB TOPOLOGY

## Core Channels

### 1. `meeting:{meeting_id}:signals`
- **Purpose**: Exchange WebRTC negotiation payloads (Offer, Answer, ICE candidates).
- **Publisher**: Node.js WebSocket instance receiving message from Client A.
- **Subscriber**: All Node.js instances hosting clients for `{meeting_id}`.
- **Payload**: `{"type": "offer", "sender": "user1", "target": "user2", "sdp": "..."}`

### 2. `meeting:{meeting_id}:events`
- **Purpose**: Non-critical meeting state broadcasts (e.g., "User typing", "Audio muted").
- **Publisher**: Any client.
- **Subscriber**: All clients in meeting.

## Connection Draining & Resilience
Node.js instances MUST gracefully unsubscribe from channels upon `SIGTERM`. If a node crashes, the client WebSocket disconnects and the client automatically attempts to reconnect to a healthy node (via the AWS ALB), which will subsequently subscribe to the required Redis channels.
