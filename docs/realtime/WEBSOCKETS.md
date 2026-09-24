# WEBSOCKET ARCHITECTURE

## Overview
WebSockets (`wss://`) carry active application data such as AI transcription chunks and presence. The meeting-room WebRTC signaling relay has been retired and its implementation is preserved under `deleted/retired-realtime-service/`.

## 1. Connection Lifecycle
- **Authentication**: JWTs cannot be sent via HTTP headers in native browser WebSocket APIs. Hide-WIN clients MUST send their JWT in the first `{"type": "authenticate", "token": "..."}` message immediately after the TCP handshake.
- **Unauthenticated Drops**: The server enforces a 5-second timeout. If a valid `authenticate` message is not received, the socket is force-closed.
- **Graceful Termination**: On `SIGTERM`, the server sends a `{"type": "server_shutdown"}` advisory and drops connections.

## 2. Heartbeat (Ping/Pong)
Stale connections (zombies) consume file descriptors.
- **Server Ping**: The Node.js server sends a `ping` frame every 30 seconds.
- **Client Pong**: The client automatically responds with a `pong` frame.
- **Timeout**: If the server misses two consecutive pongs (60 seconds), the connection is aggressively terminated and the user is purged from Redis presence.

## 3. Backpressure Handling
When broadcasting AI transcription chunks to 10,000 clients, network buffers can fill up.
- The Realtime service monitors the underlying socket `bufferedAmount`.
- If a client's buffer exceeds 512KB (slow network), the server initiates **Backpressure Mitigation**: it drops non-critical events (typing indicators) and prioritizes critical AI text chunks.

## 4. Reconnection Logic
- Clients employ **Exponential Backoff with Jitter** for reconnections (e.g., 1s, 2s, 4s, 8s + random ms) to prevent thundering herds when the AWS ALB resets connections.
- During reconnection, clients request a missed-event sync from the API based on their last received message ID.

## 5. Message Schemas
All WebSocket payloads strictly follow this JSON schema:
```json
{
  "event": "message_type",
  "payload": {},
  "timestamp": "ISO8601",
  "message_id": "uuid"
}
```
