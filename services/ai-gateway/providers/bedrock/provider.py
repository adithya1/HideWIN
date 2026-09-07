from typing import AsyncIterator
from providers.base import AIProvider
from domain.models import AIRequest, AIResponse, AIChunk

class BedrockClaudeProvider(AIProvider):
    @property
    def provider_name(self) -> str:
        return "bedrock"
        
    async def generate(self, request: AIRequest) -> AIResponse:
        pass
        
    async def stream_response(self, request: AIRequest) -> AsyncIterator[AIChunk]:
        # Boto3 Bedrock ConverseStream implementation goes here
        yield AIChunk(text_delta="Scaffolded Bedrock Claude response")
