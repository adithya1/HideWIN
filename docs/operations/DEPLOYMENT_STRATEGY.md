# ZERO DOWNTIME DEPLOYMENT STRATEGY

## Overview
Hide-WIN production enforces a strict Zero Downtime Deployment (ZDD) strategy. Deployments must not drop active API or application WebSocket requests, or cause database locks that stall the application.

## 1. Kubernetes Rolling Updates
The primary deployment strategy is a **Rolling Update**.
- **Max Unavailable**: `0%`
- **Max Surge**: `25%`
- *Behavior*: Kubernetes spins up new pods before terminating old ones. Old pods are not terminated until the new pods pass their `readinessProbe`.

## 2. Canary Deployment Support
For major AI model shifts or high-risk realtime refactors, deployments utilize a **Canary** strategy via the AWS ALB.
- 5% of traffic is routed to the canary ReplicaSet.
- Automated tests verify HTTP 5xx error rates and AI TTFT metrics.
- If successful, traffic scales up (10% -> 50% -> 100%).
- **Rollback**: If error rates exceed 1% over the baseline, traffic instantly drains back to the stable ReplicaSet.

## 3. Backward-Compatible Database Migrations (MANDATORY RULE)
Database schemas and application code are decoupled. **Never deploy destructive schema changes in the same release that requires them.**

Every schema mutation must follow this 5-Phase lifecycle:
- **Phase 1 (Prepare)**: Add the new schema (columns/tables) via Alembic. Deploy this migration.
- **Phase 2 (Support)**: Deploy application code that supports reading/writing to BOTH the old and new schema.
- **Phase 3 (Backfill)**: Run asynchronous background workers to copy historical data from the old schema to the new schema.
- **Phase 4 (Cutover)**: Deploy application code that strictly reads/writes to the new schema.
- **Phase 5 (Cleanup)**: Only after validation, drop the old schema in a final Alembic migration.

## 4. Versioned APIs
Breaking changes to the REST API must be introduced under a new version namespace (e.g., `/api/v2/`). The `v1` endpoint must remain active and translate requests into the new domain models until sunsetting is formally communicated to clients.

## 5. Deployment Verification
Before a deployment is marked successful:
1. `Readiness Gates` must report healthy for 100% of new pods.
2. Automated canary load testing is not currently configured. Add and validate a real load-test job before treating this as a deployment gate.
3. OpenTelemetry logs must confirm that the Database Connection Pool saturation remains stable.
