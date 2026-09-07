# SECURITY BASELINE

## 1. Network & Edge Security
- **AWS WAF**: Enabled on the ALB/CloudFront layer. Blocks OWASP Top 10, SQLi, XSS, and known malicious botnets.
- **mTLS**: Internal service-to-service communication (e.g., API -> AI Gateway, API -> Realtime) is secured via mTLS provided by the Kubernetes Service Mesh (e.g., Linkerd or Istio).

## 2. Application Security
- **Rate Limiting**: Redis-backed sliding window rate limiter protects all public endpoints.
  - *Unauthenticated*: 10 req / min per IP.
  - *Authenticated*: 100 req / min per User.
  - *AI Routes*: Stricter token/cost-based rate limits.
- **CORS Hardening**: Strictly whitelisted Origins. No `*` allowed in production.
- **CSP Headers**: Content Security Policy enforced on all web-facing assets to prevent XSS.
- **Injection Prevention**: All database access is strictly routed through SQLAlchemy ORM parameters. Raw SQL is forbidden.

## 3. Secrets Management
- **AWS Secrets Manager**: API keys, Database passwords, and JWT salts are stored exclusively in AWS Secrets Manager.
- **External Secrets Operator (ESO)**: Syncs AWS Secrets into Kubernetes native Secrets in memory.
- **No Git Secrets**: Pre-commit hooks (`trufflehog` / `git-secrets`) are mandatory to block accidental secret commits.

## 4. Vulnerability Scanning
- **Dependencies**: GitHub Dependabot / Snyk active on all `package.json` and `requirements.txt` files.
- **Containers**: AWS ECR Basic Scanning enabled. Deployments blocked on `CRITICAL` or `HIGH` CVEs.
