from typing import List, Optional, Dict, Any, AsyncIterator
from pydantic import BaseModel, Field

class AIUsage(BaseModel):
    prompt_tokens: int = 0
    completion_tokens: int = 0
    total_tokens: int = 0
    cost_estimate_usd: float = 0.0

class AITool(BaseModel):
    name: str
    description: str
    parameters: Dict[str, Any]

class AIContext(BaseModel):
    system_prompt: str
    messages: List[Dict[str, str]]
    tools: Optional[List[AITool]] = None

class AIRequest(BaseModel):
    context: AIContext
    model_family_preference: Optional[str] = "claude"
    temperature: float = 0.7
    max_tokens: int = 1000
    stream: bool = True
    timeout_ms: int = 5000

class AIResponse(BaseModel):
    content: str
    usage: AIUsage
    model_used: str
    provider_used: str
    latency_ms: int

class AIChunk(BaseModel):
    text_delta: str
    finish_reason: Optional[str] = None
    usage: Optional[AIUsage] = None

class AIError(Exception):
    def __init__(self, message: str, provider: str, status_code: int = 500, retryable: bool = False):
        self.message = message
        self.provider = provider
        self.status_code = status_code
        self.retryable = retryable
        super().__init__(self.message)
