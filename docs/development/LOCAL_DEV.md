# LOCAL DEVELOPMENT ENVIRONMENT

## Overview
To ensure development parity with production, we utilize Docker Compose to spin up exact replicas of the AWS infrastructure locally.

## Architecture Mocks
- **Database**: PostgreSQL 15 (Matches Aurora)
- **Cache/PubSub**: Valkey 7.2 (Matches ElastiCache)
- **Object Storage**: MinIO (Matches AWS S3)
- **AWS APIs**: LocalStack (Mocks Secrets Manager, KMS, SQS)
- **Observability**: (Optional) Jaeger/Prometheus for local tracing visualization

## Quickstart

1. **Start the Environment**
   ```bash
   make up
   ```
   *This starts the services defined in the selected Docker Compose configuration.*

2. **Accessing Services**
   - API (FastAPI): `http://localhost:8000/docs`
   - MinIO Console: `http://localhost:9001` (admin/password)
   - PgAdmin: `http://localhost:5050` (admin@admin.com/admin)

3. **Live Reloading**
   The `docker-compose.dev.yml` file mounts the API source directory. API changes trigger `uvicorn --reload`.

4. **Shutdown & Cleanup**
   ```bash
   make down
   ```
