# Local Setup and Configuration

[Index](./00_INDEX.md) · [Previous](./24_DEVOPS_CICD_DEPLOYMENT.md) · [Next](./26_PERFORMANCE_SLO_CAPACITY.md)

---


## Prerequisites

Recommended:
- Python 3.12+
- Node.js LTS
- Docker + Docker Compose
- Git
- Make or task runner optional

## Bootstrap

```bash
git clone <repo>
cd <repo>
cp .env.example .env
docker compose up -d postgres redis rabbitmq minio
python -m venv .venv
source .venv/bin/activate
pip install -r requirements-dev.txt
alembic upgrade head
cd apps/web && npm install
```

Use the repository’s actual package manager/lockfiles once scaffolded.

## Required environment variables

### App
```text
APP_ENV=local
APP_BASE_URL=http://localhost:8000
WEB_BASE_URL=http://localhost:5173
LOG_LEVEL=INFO
```

### Database/cache/queue
```text
DATABASE_URL=postgresql+asyncpg://...
REDIS_URL=redis://...
RABBITMQ_URL=amqp://...
```

### Object storage
```text
S3_ENDPOINT_URL=http://localhost:9000
S3_BUCKET=content-transform-local
S3_ACCESS_KEY=...
S3_SECRET_KEY=...
S3_REGION=us-east-1
```

### Auth
```text
AUTH_PROVIDER=firebase
FIREBASE_PROJECT_ID=...
FIREBASE_CREDENTIALS_JSON=...
```

### AI
```text
LLM_PRIMARY_PROVIDER=anthropic
LLM_FALLBACK_PROVIDER=openai
ANTHROPIC_API_KEY=...
OPENAI_API_KEY=...
MODEL_ALIAS_GENERATION_STANDARD=...
MODEL_ALIAS_GENERATION_FAST=...
EMBEDDING_PROVIDER=local_sbert
EMBEDDING_MODEL=...
```

### Limits
```text
MAX_UPLOAD_MB=50
MAX_SOURCE_TOKENS=200000
MAX_CONCURRENT_TRANSFORMS_PER_WORKSPACE=3
DEFAULT_MONTHLY_AI_BUDGET_USD=25
```

## Optional environment variables

```text
CLAMAV_HOST=
PII_MODE=detect_only
OTEL_EXPORTER_OTLP_ENDPOINT=
PROMETHEUS_ENABLED=true
SENTRY_DSN=
```

## Secrets rule

`.env` is local only and ignored by Git.
Commit `.env.example` with placeholders and comments, never credentials.

## Seed

Development seed should create:
- one workspace,
- admin/editor/reviewer users or mock identities,
- default brand profile,
- active prompt versions for 3 P0 transformers,
- example text source.

## Local auth shortcut

A development-only fake auth adapter is allowed behind `APP_ENV=local/test`.
It must fail startup if enabled in staging/production.

## Developer smoke test

After setup:
1. `/health/ready` returns OK.
2. create project.
3. add direct text source.
4. source reaches READY.
5. run executive summary transformer.
6. output version appears with quality report.
7. download Markdown.
