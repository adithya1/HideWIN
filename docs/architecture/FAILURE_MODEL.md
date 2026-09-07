# FAILURE MODEL

## Probes & Health Checks
- **Liveness Probes**: HTTP 200 on `/healthz` (no dependencies checked).
- **Readiness Probes**: HTTP 200 on `/ready` (verifies Postgres/Redis connectivity).
- **Timeout Strategy**: 5s hard timeout on AI Gateway requests.

## Failure Scenarios
1. **Redis Fails**: 
   - *Impact*: Signaling degrades.
   - *Behavior*: Fall back to local memory bounded mode (limits capacity).
2. **Aurora Fails**: 
   - *Impact*: Core APIs fail.
   - *Behavior*: PgBouncer queues connections; Read-Replicas promoted.
3. **Primary AI Provider (Bedrock) Fails**:
   - *Impact*: TTFT spikes.
   - *Behavior*: Circuit breaker triggers after 3 consecutive timeouts -> routes to GeminiProvider.
