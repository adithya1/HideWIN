from typing import Dict, List
from providers.base import AIProvider
from domain.models import AIRequest, AIError

class ModelRouter:
    def __init__(self):
        self.providers: Dict[str, AIProvider] = {}
        
    def register_provider(self, provider: AIProvider):
        self.providers[provider.provider_name] = provider
        
    def select_provider(self, request: AIRequest, exclude: List[str] = None) -> AIProvider:
        exclude = exclude or []
        preferred = request.model_family_preference
        
        # Example routing logic: Try Bedrock Claude first, fallback to Anthropic direct, then Gemini
        routing_order = ["bedrock", "anthropic", "gemini", "openai"]
        
        for name in routing_order:
            if name in self.providers and name not in exclude:
                return self.providers[name]
                
        raise AIError("No eligible AI providers available", provider="router", retryable=False)
