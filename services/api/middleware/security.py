import json
from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import JSONResponse

class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    """
    Enforces strict security headers for all HTTP responses.
    """
    async def dispatch(self, request: Request, call_next):
        response = await call_next(request)
        
        # Prevent Clickjacking
        response.headers["X-Frame-Options"] = "DENY"
        # Prevent MIME-sniffing
        response.headers["X-Content-Type-Options"] = "nosniff"
        # Strict Transport Security (HSTS)
        response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
        # Basic Content Security Policy
        response.headers["Content-Security-Policy"] = "default-src 'self'; frame-ancestors 'none';"
        
        return response

class RedisRateLimitMiddleware(BaseHTTPMiddleware):
    """
    Scaffold for distributed rate limiting.
    In production, this queries Redis using a Sliding Window or Token Bucket algorithm.
    """
    async def dispatch(self, request: Request, call_next):
        client_ip = request.client.host
        
        # Pseudo-code for Redis check:
        # allowed = await redis_client.check_rate_limit(f"ratelimit:{client_ip}", limit=100, window=60)
        # if not allowed:
        #     return JSONResponse(status_code=429, content={"error": "Too Many Requests"})
            
        return await call_next(request)
