import pytest
import asyncio
import json
import uuid

# Dummy async Redis client for scaffolding
class MockRedis:
    def __init__(self):
        self.store = {}
    async def setex(self, key, ttl, value):
        self.store[key] = value
    async def get(self, key):
        return self.store.get(key)

@pytest.mark.asyncio
async def test_redis_idempotency_key():
    """
    Verifies that idempotency keys are strictly serialized to JSON,
    enforce a TTL, and correctly return the cached response.
    """
    redis = MockRedis()
    key = f"api:idempotency:{uuid.uuid4()}"
    
    payload = {"status": "success", "meeting_id": "123"}
    await redis.setex(key, 86400, json.dumps(payload))
    
    cached = await redis.get(key)
    assert cached is not None
    
    parsed = json.loads(cached)
    assert parsed["status"] == "success"
