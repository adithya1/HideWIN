Availability
------------
Production target: 99.99%

Realtime
--------
Concurrent sessions: 10,000
Reconnect success: >99%
Signaling p95: <250ms

AI
--
TTFT p50: <700ms
TTFT p95: <1500ms
First useful response p95: <2.5s
Target first useful response: <=2s

API
---
p50: <100ms
p95: <250ms
p99: <500ms

WebRTC
------
ICE success: >99%
Packet loss: monitored
Jitter: monitored
TURN capacity: load-tested

Database
--------
Connection pool saturation: <80%
Query p95: <100ms for normal OLTP queries

Redis
-----
p95: <20ms

Deployment
----------
Zero-downtime target
Automated rollback

*Note: These are engineering targets and acceptance criteria for the architecture migration, not claims of current system capacity. They must be verified through reproducible load tests.*
