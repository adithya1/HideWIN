from abc import ABC, abstractmethod
from typing import AsyncIterator
from domain.models import AIRequest, AIResponse, AIChunk

class AIProvider(ABC):
    @property
    @abstractmethod
    def provider_name(self) -> str:
        pass
        
    @abstractmethod
    async def generate(self, request: AIRequest) -> AIResponse:
        pass
        
    @abstractmethod
    async def stream_response(self, request: AIRequest) -> AsyncIterator[AIChunk]:
        pass
