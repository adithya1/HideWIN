import json
import logging
from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware
from opentelemetry import trace
from opentelemetry.trace.propagation.tracecontext import TraceContextTextMapPropagator

logger = logging.getLogger("json_logger")
tracer = trace.get_tracer(__name__)

class OpenTelemetryMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        # Extract trace context from headers (e.g., from AWS ALB or Global Accelerator)
        ctx = TraceContextTextMapPropagator().extract(carrier=request.headers)
        
        with tracer.start_as_current_span(
            f"{request.method} {request.url.path}", 
            context=ctx,
            kind=trace.SpanKind.SERVER
        ) as span:
            
            span.set_attribute("http.method", request.method)
            span.set_attribute("http.url", str(request.url))
            
            try:
                response = await call_next(request)
                span.set_attribute("http.status_code", response.status_code)
                
                # Structured Logging with Trace Correlation
                trace_id = trace.format_trace_id(span.get_span_context().trace_id)
                logger.info(json.dumps({
                    "event": "http_request",
                    "method": request.method,
                    "path": request.url.path,
                    "status": response.status_code,
                    "trace_id": trace_id
                }))
                
                return response
                
            except Exception as e:
                span.record_exception(e)
                span.set_attribute("http.status_code", 500)
                
                trace_id = trace.format_trace_id(span.get_span_context().trace_id)
                logger.error(json.dumps({
                    "event": "http_error",
                    "error": str(e),
                    "trace_id": trace_id
                }))
                raise
