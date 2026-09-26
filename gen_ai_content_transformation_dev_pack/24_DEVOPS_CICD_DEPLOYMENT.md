# DevOps, CI/CD and Deployment

[Index](./00_INDEX.md) · [Previous](./23_TESTING_EVALUATION.md) · [Next](./25_LOCAL_SETUP_CONFIG.md)

---


## Environments

- `local`
- `test`
- `staging`
- `production` optional for academic demo

Configuration differs by environment; code does not.

## Local deployment

Docker Compose services:
- api,
- web,
- worker-ingestion,
- worker-transform,
- worker-delivery,
- postgres + pgvector,
- redis,
- rabbitmq,
- minio.

AI provider remains external unless local mock is configured.

## Containers

- non-root user,
- multi-stage builds,
- pinned dependencies/lockfiles,
- health endpoints,
- no secrets baked into image,
- minimal runtime image.

## GitHub Actions

### Pull request
1. format/lint.
2. Python typecheck.
3. TypeScript typecheck.
4. unit tests.
5. integration subset.
6. secret/dependency scan.
7. build images.

### Main branch
1. all PR checks.
2. build/tag images with commit SHA.
3. publish to registry if configured.
4. migrate staging DB.
5. deploy staging.
6. smoke/E2E tests.
7. manual promotion to production.

## Database migrations

Deployment sequence:
1. backup/snapshot when production.
2. run backward-compatible migration.
3. deploy API/workers.
4. run post-deploy smoke checks.
5. perform destructive cleanup only in later migration.

## Kubernetes path

Proposal-aligned production topology:
- Deployment: API.
- Deployment: workers by queue.
- Service/Ingress: API/web.
- managed PostgreSQL/Redis preferred.
- RabbitMQ managed or cluster.
- S3 object storage.
- ConfigMaps/Secrets.
- HorizontalPodAutoscaler for API/workers.

## Helm values

Separate values:
- `values-staging.yaml`,
- `values-prod.yaml`.

Do not store secrets in values files.

## Health checks

- `/health/live` process live.
- `/health/ready` DB/cache required dependencies ready.
- worker heartbeat metric.

## Rollback

Application rollback uses previous image tag.
DB rollback only if migration is designed safe; prefer forward fix.

## Infrastructure security

- private DB/Redis/RabbitMQ,
- network policies/security groups,
- least-privilege object-store credentials,
- TLS ingress,
- restricted admin endpoints.

## Demo mode

For academic demonstration, local Docker Compose is acceptable and avoids recurring cloud cost while still proving architecture.
