# HIGH LEVEL DESIGN

## Topology

```mermaid
graph TD
    Client[Electron / Web Client] -->|HTTPS / WSS| CF[CloudFront / WAF]
    CF --> GA[AWS Global Accelerator]
    GA --> ALB[Application Load Balancer]
    
    ALB --> API[API Service - EKS]
    ALB --> RT[Realtime Service - EKS]
    ALB --> AIG[AI Gateway - EKS]
    
    API --> PB[PgBouncer]
    PB --> Aurora[(Aurora PostgreSQL)]
    
    RT --> Redis[(Redis / Valkey)]
    
    AIG --> Claude[Anthropic / Bedrock]
    AIG --> Gemini[Google Gemini]
    
    Client -->|ICE/UDP| TURN[Dedicated TURN Cluster]
```

## Core Services

### 1. API Service (hidewin-fastapi)
- **Responsibility**: Core business logic, meeting lifecycle, auth.
- **Scaling Strategy**: HPA on CPU (60%) and Request Latency.
- **State**: Stateless.

### 2. Realtime Service (hidewin-cloud-relay)
- **Responsibility**: WebRTC signaling, presence, pub/sub.
- **Scaling Strategy**: HPA on active connections.
- **State**: Externalized to Redis.

### 3. AI Gateway
- **Responsibility**: Model routing, streaming, circuit breaking, prompt assembly.
- **Scaling Strategy**: HPA on queue depth and TTFT.
- **State**: Stateless.
