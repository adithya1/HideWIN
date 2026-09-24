# WEBRTC CAPACITY PLANNING

## Target: 10,000 Concurrent Sessions

### Realtime Service (WebSocket Signaling)
- **Connections per Pod**: 2,500
- **Total Pods**: 4 active + 1 spare (EKS)
- **Memory**: ~200KB per connection = 500MB per Pod.
- **CPU**: Dependent on message throughput; autoscaling on 60% CPU.

### Redis
- **Operations**: ~2 pub/sub events per second per active speaking user.
- **Node Type**: AWS ElastiCache Valkey (cache.m7g.large).

### Load Testing
*We do not claim 10,000 session capacity until proven by the automated load testing suite in `tests/load/` using headless WebRTC clients.*
