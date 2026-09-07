# STUN / TURN INFRASTRUCTURE

## Why TURN is Mandatory
Enterprise networks (symmetric NATs, strict firewalls) block peer-to-peer UDP traffic. STUN alone fails in ~20-30% of corporate environments. A robust TURN infrastructure is required.

## Target Infrastructure (coturn)
- **Deployment**: Autoscaling group of `coturn` instances behind AWS Network Load Balancer (NLB).
- **Authentication**: REST API dynamically generates time-limited TURN credentials (HMAC) via `services/realtime`.
- **Media Protocol**: UDP preferred, falling back to TCP/TLS for deep packet inspection bypass.

## Capacity Targets
- **Bandwidth**: 10,000 sessions * 50kbps (Audio only) = ~500 Mbps aggregated TURN bandwidth minimum.
