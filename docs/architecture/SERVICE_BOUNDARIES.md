# SERVICE BOUNDARIES

## 1. API Service
- **APIs**: RESTful (Users, Meetings, Billing).
- **Dependencies**: PostgreSQL.
- **Security Boundary**: Validates JWTs; enforces RBAC.

## 2. Realtime Service
- **APIs**: WebSocket (Signaling).
- **Dependencies**: Redis.
- **Security Boundary**: Upgrades WSS only with valid JWT.

## 3. Transcription Service (Whisper Workers)
- **APIs**: Internal gRPC / Kafka.
- **Dependencies**: S3 (Audio artifacts).
- **Security Boundary**: No public ingress; internal VPC access only.
