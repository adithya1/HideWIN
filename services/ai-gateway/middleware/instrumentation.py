import time
import logging
from typing import Callable, Any

logger = logging.getLogger("ai_metrics")

class AILatencyTracker:
    """
    Instruments the AI Gateway to record TTFT and completion latencies.
    Ready for OpenTelemetry span integration.
    """
    
    def __init__(self, request_id: str, provider: str, model: str):
        self.request_id = request_id
        self.provider = provider
        self.model = model
        self.start_time = time.perf_counter()
        self.ttft = None
        self.total_time = None
        
    def record_first_token(self):
        if self.ttft is None:
            self.ttft = (time.perf_counter() - self.start_time) * 1000
            
    def record_completion(self):
        self.total_time = (time.perf_counter() - self.start_time) * 1000
        self._flush_metrics()
        
    def _flush_metrics(self):
        # Structured log for metrics ingestion (e.g., Datadog, Prometheus)
        logger.info(
            f"AI_METRIC RequestID={self.request_id} Provider={self.provider} Model={self.model} "
            f"TTFT={self.ttft:.2f}ms TotalLatency={self.total_time:.2f}ms"
        )
