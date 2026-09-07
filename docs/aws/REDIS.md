# REDIS / VALKEY ARCHITECTURE

## Purpose
Redis (or AWS ElastiCache Valkey) is utilized exclusively for ephemeral, high-throughput distributed coordination. It must NEVER be used to store authoritative durable business data.

## Approved Workloads
1. **WebRTC Signaling**: Pub/Sub for cross-node SDP exchange.
2. **Session Presence**: Active users in a meeting.
3. **Rate Limiting**: API throttling (Token Bucket / Sliding Window).
4. **Idempotency Keys**: Preventing duplicate POST executions.
5. **Distributed Caching**: Very short-lived API response caching.
6. **Distributed Locks**: Rare, critical path coordination (e.g., Redlock).

## Standards & Policies

### 1. Key Naming Convention
Format: `namespace:entity:id:attribute`
Example: `rt:meeting:1234:presence` or `api:rate_limit:user_888`

### 2. TTL Policy (MANDATORY)
**EVERY key must have a TTL.**
- Presence: 30 seconds (renewed by heartbeat)
- Idempotency Keys: 24 hours
- Rate Limits: 1 minute
- Distributed Locks: 10 seconds

### 3. Eviction Policy
Target Eviction: `volatile-lru` (Evict keys with expiration set, least recently used).

### 4. Serialization
Strictly JSON. No Python `pickle`.

### 5. Failure & Fallback Behavior
- **API Cache**: If Redis is unreachable, log warning, skip cache, and query PostgreSQL.
- **Idempotency**: If Redis is unreachable, fail open (allow request) but log heavily.
- **WebRTC**: If Redis is unreachable, degrade to local-node signaling (guests on different nodes cannot connect).
