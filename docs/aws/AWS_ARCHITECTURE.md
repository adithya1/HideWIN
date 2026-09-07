# AWS PRODUCTION ARCHITECTURE

## High Availability Target
Hide-WIN production is deployed across 3 Availability Zones (AZs) in a single primary region (e.g., `us-east-1`), with architecture designed to expand to active-active multi-region via Global Accelerator.

## Infrastructure Components
- **Edge**: Route53 (DNS) -> AWS WAF (Security) -> CloudFront (Static Web/Assets) / Global Accelerator (API & WebRTC).
- **Ingress**: Application Load Balancer (ALB) routing to EKS.
- **Compute**: Amazon EKS (Elastic Kubernetes Service) hosting API, Realtime, AI Gateway, and Worker nodes.
- **Database**: Amazon Aurora PostgreSQL (Multi-AZ) in private subnets.
- **Cache/State**: Amazon ElastiCache Valkey (Multi-AZ) in private subnets.
- **Storage**: Amazon S3 for meeting recordings and attachments.
- **Messaging**: Amazon SQS for asynchronous transcription/analytics worker queues.
- **Security**: AWS Secrets Manager (Credentials), AWS KMS (Encryption at rest), IAM Roles for Service Accounts (IRSA).
- **Observability**: CloudWatch, X-Ray (via OpenTelemetry).

## Security Posture
- **Private by Default**: EKS Node Groups, Aurora, and Valkey reside entirely in private subnets with NO public IPs.
- **Egress**: NAT Gateways provided for EKS worker nodes to reach external AI providers (Anthropic, OpenAI).
- **IRSA**: Pods assume least-privilege IAM roles rather than sharing a node-level role.
- **Encryption**: TLS 1.2+ for in-transit. KMS CMKs for S3, Aurora, and EBS at rest.
