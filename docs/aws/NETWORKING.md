# AWS NETWORKING STRATEGY

## VPC Design (10.0.0.0/16)
- **Public Subnets (/24)**: Contains ALB, NAT Gateways, Bastion (if necessary).
- **Private EKS Subnets (/22)**: Contains EKS Worker Nodes.
- **Private Data Subnets (/24)**: Contains Aurora PostgreSQL, ElastiCache Valkey.

## Traffic Flow (WebRTC)
- **Signaling**: Client -> Global Accelerator -> ALB -> EKS (Node.js Realtime Service).
- **STUN/TURN**: Client -> Network Load Balancer (NLB) -> Coturn EKS Pods (UDP/TCP).

## Egress Optimization
- **VPC Endpoints**: S3, DynamoDB, Secrets Manager, and ECR utilize AWS PrivateLink (VPC Endpoints) to bypass NAT Gateway data transfer charges and improve security.
