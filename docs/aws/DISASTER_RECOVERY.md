# DISASTER RECOVERY (DR) STRATEGY

## RPO & RTO Targets
- **Recovery Point Objective (RPO)**: 5 Minutes (Database), 1 Hour (S3).
- **Recovery Time Objective (RTO)**: 15 Minutes for single AZ failure; 4 Hours for full regional failure.

## Resilience Mechanisms
1. **Database**: Aurora PostgreSQL maintains 3 copies of data across 3 AZs. Continuous backups to S3 enable Point-in-Time Recovery (PITR) up to 35 days.
2. **Infrastructure**: Terraform ensures infrastructure can be identically provisioned in a secondary region (e.g., `us-west-2`) via CI/CD.
3. **Stateless Compute**: EKS Pods are ephemeral. If an AZ goes down, the Cluster Autoscaler provisions new nodes in healthy AZs.

## Regional Failover (Future)
When multi-region is activated, Aurora Global Database will replicate to Region B. Route53/Global Accelerator will detect regional health check failures and drain traffic to Region B.
