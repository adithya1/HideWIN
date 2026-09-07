# WORKER ARCHITECTURE (ASYNCHRONOUS JOBS)

## Overview
To guarantee API responsiveness (fast TTFB/TTFT), all heavy computational or long-running tasks are offloaded from the main FastAPI / Node.js threads to dedicated background workers.

## Tooling
- **Message Broker**: Amazon SQS (Standard queues for throughput, FIFO queues where strict ordering is required).
- **Python Framework**: Celery (integrated with SQS/Redis) or AWS Lambda depending on execution duration.

## Job Candidates
1. **Transcription Post-Processing**: Aligning VAD chunks, speaker diarization, and formatting whisper outputs.
2. **AI Summarization**: Generating long-form post-meeting notes and action items.
3. **Analytics Aggregation**: Batching meeting metrics into reporting tables.
4. **Email/Notification Delivery**: Sending post-meeting recaps.

## Enterprise Requirements

### 1. Dead Letter Queues (DLQ)
Every SQS queue is paired with a DLQ. If a job fails to process after `maxReceiveCount` (e.g., 3 attempts), the message is routed to the DLQ. Alerts fire on DLQ depth > 0, allowing engineers to debug the payload and redrive the message without data loss.

### 2. Idempotency
Worker tasks MUST be idempotent. If a worker crashes mid-execution and the message is re-delivered, running the task a second time must not corrupt the database or send duplicate emails. (Use database `version` checks or Redis idempotency keys).

### 3. Retry Policies
Transient failures (e.g., network timeouts to Anthropic) throw specific `RetryableException`s, triggering an exponential backoff retry. Terminal failures (e.g., malformed payloads) are rejected immediately to the DLQ.

### 4. Graceful Shutdown
Worker processes intercept `SIGTERM`. They will reject new jobs, finish their currently executing job (up to a 60s timeout), acknowledge the message to SQS, and exit safely.
