# OBSERVABILITY & INSTRUMENTATION

## Architecture
Hide-WIN utilizes **OpenTelemetry (OTel)** as the unified standard for traces, metrics, and logs. This prevents vendor lock-in and allows seamless integration with AWS CloudWatch, X-Ray, Datadog, or Prometheus.

## 1. Distributed Tracing
Trace context (Trace ID, Span ID) is propagated across all service boundaries (HTTP headers `traceparent`, Kafka/SQS headers, WebRTC metadata).

**Traced Components:**
- **HTTP Requests**: Route, method, status code, latency.
- **Database Queries**: SQLAlchemy spans (SQL statement, latency, connection pool acquisition time).
- **Redis Calls**: Command, key namespace, latency.
- **AI Gateway**: Provider, model, TTFT, token usage, completion latency.
- **Worker Queues**: Enqueue, dequeue, execution latency.

## 2. Structured Logging
All applications MUST output logs in single-line JSON format.
**Mandatory Fields:**
- `timestamp` (ISO8601 UTC)
- `level` (INFO, WARN, ERROR)
- `trace_id` (For log-to-trace correlation)
- `span_id`
- `message`
- `service_name`

## 3. Tail-Based Sampling
To manage costs across 10,000 concurrent sessions, the OTel Collector implements **Tail-Based Sampling**:
- **100%** of traces with HTTP 5xx errors or exceptions are retained.
- **100%** of traces where AI TTFT > 2.5s are retained.
- **5%** of all other successful traces are retained.
