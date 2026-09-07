# Cloud Deployment Guide

## Infrastructure Architecture
Hide-WIN targets deployment on AWS, utilizing:
- **EKS** (Elastic Kubernetes Service) for the application pods
- **Aurora PostgreSQL** for the database
- **ElastiCache (Redis)** for the signaling plane

## Environment Variables and Secrets
NEVER commit production secrets to Git.
- **AWS**: Store `JWT_SECRET_KEY` and `DATABASE_URL` in **AWS Secrets Manager**.
- **GitHub**: Store deployment credentials in **GitHub Secrets**.

## Kubernetes Deployment
Ensure your `kubectl` context is set to the production cluster, then apply the manifests:
```bash
kubectl apply -k kubernetes/production
```
