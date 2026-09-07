# ENTERPRISE TARGET ARCHITECTURE

## Vision
Hide-WIN's target architecture is a highly available, multi-AZ cloud-native platform deployed on AWS via EKS. It embraces Clean Architecture, strict decoupling of state, and horizontal scalability to support 10,000+ concurrent WebRTC sessions and sub-second AI inference.

## Key Design Principles
1. **Stateless Services**: All API and Realtime node instances are stateless. Session state is externalized to Redis/Valkey.
2. **AI Provider Abstraction**: AI interactions route through an AI Gateway defining an `AIProvider` interface. No vendor lock-in.
3. **Data Persistence**: SQLite is replaced by Amazon Aurora PostgreSQL for robust ACID compliance, pooling via PgBouncer.
4. **Signaling vs. Media**: WebRTC signaling is routed via WebSockets (Realtime Service); STUN/TURN traffic is handled by dedicated infrastructure.

## Documentation Navigation
- [High Level Design](docs/architecture/HIGH_LEVEL_DESIGN.md)
- [Low Level Design](docs/architecture/LOW_LEVEL_DESIGN.md)
- [Service Boundaries](docs/architecture/SERVICE_BOUNDARIES.md)
- [Data Flow](docs/architecture/DATA_FLOW.md)
- [Dependency Graph](docs/architecture/DEPENDENCY_GRAPH.md)
- [Failure Model](docs/architecture/FAILURE_MODEL.md)
