import os
import json
import time
import asyncio
from typing import Optional
try:
    import redis.asyncio as redis
except ImportError:
    redis = None

REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379/0")

class RedisManager:
    def __init__(self):
        self.client: Optional[redis.Redis] = None
        self.enabled = False

    async def connect(self):
        if redis is None:
            print("Redis library not installed. Run `pip install redis`. Running without Redis.")
            return
        try:
            self.client = redis.from_url(REDIS_URL, decode_responses=True)
            await self.client.ping()
            self.enabled = True
            print("Connected to Redis for Enterprise Key Management & Rate Limiting.")
        except Exception as e:
            print(f"Failed to connect to Redis: {e}. Running in degraded (local) mode.")

    async def close(self):
        if self.client:
            await self.client.close()

    async def get_healthy_key(self, provider: str, available_keys: list[dict], required_tpm: int = 1000) -> Optional[dict]:
        if not self.enabled or not self.client:
            return available_keys[0] if available_keys else None

        now = int(time.time())
        best_key = None
        lowest_usage = float('inf')

        for key_obj in available_keys:
            key_id = f"ratelimit:{provider}:{key_obj['id']}"
            if await self.client.get(f"cooldown:{key_id}"):
                continue
            await self.client.zremrangebyscore(key_id, 0, now - 60)
            usage = await self.client.zcard(key_id)
            if usage < lowest_usage:
                lowest_usage = usage
                best_key = key_obj
        return best_key
        
    async def log_key_usage(self, provider: str, key_id: int):
        if not self.enabled or not self.client:
            return
        now = int(time.time())
        rkey = f"ratelimit:{provider}:{key_id}"
        await self.client.zadd(rkey, {f"{now}-{id(self)}": now})
        await self.client.expire(rkey, 65)
        
    async def mark_key_exhausted(self, provider: str, key_id: int):
        if not self.enabled or not self.client:
            return
        rkey = f"ratelimit:{provider}:{key_id}"
        await self.client.setex(f"cooldown:{rkey}", 60, "exhausted")

redis_manager = RedisManager()
