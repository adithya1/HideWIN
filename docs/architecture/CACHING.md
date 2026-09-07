# MULTI-TIER CACHING STRATEGY

## Overview
To support 10,000 concurrent sessions while minimizing Aurora PostgreSQL and AWS Bedrock load, Hide-WIN employs a strict Multi-Tier caching architecture.

## Tier 1: CDN / Edge (CloudFront)
- **Target**: Static assets, compiled React bundles, images, fonts.
- **Strategy**: Aggressive `Cache-Control: public, max-age=31536000, immutable`.
- **Invalidation**: Assets are fingerprinted during the CI/CD Webpack/Vite build (e.g., `main.a3f9b2.js`). We never issue CDN invalidations; we just roll out new HTML referencing new fingerprints.

## Tier 2: Distributed Cache (Redis/Valkey)
- **Target**: API Responses, User Profiles, Feature Flags, Rate Limits.
- **Strategy**: Read-through and Write-through caching.
- **Cache Stampede Prevention**: If a highly-accessed cache key expires, 10,000 users might simultaneously hit the database. We utilize a **Redis Mutex (Lock)**:
  1. Process A misses cache, acquires lock, queries DB.
  2. Processes B-Z miss cache, fail to acquire lock, and sleep for 50ms before retrying the cache.
- **Invalidation**: Hard TTLs + programmatic eviction on database `PUT/POST/DELETE` operations.

## Tier 3: In-Memory / L1 Cache (API Node)
- **Target**: Extremely hot, read-heavy, slowly changing data (e.g., global configuration, tier limits).
- **Strategy**: LRU Cache in Python/Node memory.
- **Invalidation**: Short TTL (e.g., 60 seconds). If instant invalidation is required, a Redis Pub/Sub broadcast triggers a local cache purge across all pods.

## AI Prompt Caching
- **Target**: AI Gateway system prompts and recent meeting context.
- **Strategy**: Utilize Anthropic's native Prompt Caching API features. The system prompt is marked as cacheable, significantly reducing token processing cost and TTFT latency on subsequent chunks in the same meeting.
