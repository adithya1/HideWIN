import time
import logging
from typing import AsyncIterator, List
from routing.router import ModelRouter
from domain.models import AIRequest, AIResponse, AIChunk, AIError

logger = logging.getLogger(__name__)

class AIOrchestrator:
    def __init__(self, router: ModelRouter):
        self.router = router
        
    async def stream_with_fallback(self, request: AIRequest) -> AsyncIterator[AIChunk]:
        failed_providers: List[str] = []
        max_attempts = 3
        
        for attempt in range(max_attempts):
            try:
                provider = self.router.select_provider(request, exclude=failed_providers)
                logger.info(f"Routing AI request to {provider.provider_name} (Attempt {attempt+1})")
                
                # We yield from the async generator
                async for chunk in provider.stream_response(request):
                    yield chunk
                    
                # If we get here successfully, we're done
                return
                
            except AIError as e:
                logger.warning(f"Provider {e.provider} failed: {e.message}")
                failed_providers.append(e.provider)
                if not e.retryable and attempt == max_attempts - 1:
                    raise
                    
            except Exception as e:
                logger.error(f"Unexpected provider error: {str(e)}")
                # Circuit breaker / exponential backoff would be recorded here
                if attempt == max_attempts - 1:
                    raise AIError(f"All providers failed. Last error: {str(e)}", provider="orchestrator", status_code=500)
                    
                time.sleep(2 ** attempt) # Simple exponential backoff
