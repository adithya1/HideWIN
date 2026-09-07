import pytest
import time
import asyncio
from unittest.mock import AsyncMock, MagicMock

# Attempt to import our new modules
try:
    from core.redis import RedisManager
except ImportError:
    RedisManager = None

@pytest.mark.asyncio
async def test_redis_manager_fallback():
    """Test that RedisManager falls back to the first key if Redis is offline/disabled."""
    assert RedisManager is not None, "RedisManager not found"
    
    rm = RedisManager()
    rm.enabled = False  # Simulate offline Redis
    
    mock_keys = [{"id": 1, "api_key_value": "sk-1"}, {"id": 2, "api_key_value": "sk-2"}]
    
    key = await rm.get_healthy_key("groq", mock_keys)
    assert key["id"] == 1, "Should fallback to the first available key"

@pytest.mark.asyncio
async def test_redis_manager_token_bucket():
    """Test the healthy key selection logic (mocking redis)."""
    rm = RedisManager()
    rm.enabled = True
    
    # Mock the underlying redis client
    rm.client = AsyncMock()
    
    # Simulate: Key 1 is in cooldown (exhausted)
    # Simulate: Key 2 has 50 requests
    # Simulate: Key 3 has 10 requests
    
    async def mock_get(k):
        if "cooldown" in k and "1" in k:
            return "exhausted"
        return None
        
    rm.client.get.side_effect = mock_get
    
    async def mock_zcard(k):
        if "2" in k: return 50
        if "3" in k: return 10
        return 0
        
    rm.client.zcard.side_effect = mock_zcard
    
    mock_keys = [
        {"id": 1, "api_key_value": "sk-1"},
        {"id": 2, "api_key_value": "sk-2"},
        {"id": 3, "api_key_value": "sk-3"}
    ]
    
    best_key = await rm.get_healthy_key("groq", mock_keys)
    
    # Should pick Key 3 because Key 1 is in cooldown and Key 3 has fewer requests than Key 2
    assert best_key["id"] == 3, f"Expected key 3, got {best_key['id']}"

