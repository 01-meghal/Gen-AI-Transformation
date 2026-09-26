# Gen AI Platform for Automated Content Transformation — Development Pack

[Index](./00_INDEX.md) · [Next](./00_INDEX.md)

---


This folder converts the approved academic proposal into a development-ready technical specification for the MVP and its immediate extension path.

## Target readiness

- Documentation coverage target: **95%+ development readiness**.
- Core implementation path is fully specified: ingestion → understanding → transformation → validation → review → rendering/delivery.
- Remaining choices are intentionally isolated in [29_RISKS_ADRS_OPEN_DECISIONS.md](./29_RISKS_ADRS_OPEN_DECISIONS.md).
- The pack is optimized for a senior AI/full-stack developer to start implementation without needing another requirements pass.

## Project baseline

The platform ingests heterogeneous content, understands the source, generates audience/channel-specific outputs, supports human review, and produces downloadable or API-deliverable artifacts.

Core MVP outputs:
1. LinkedIn post.
2. Executive summary.
3. Twitter/X post or thread.

Designed extension outputs:
- Advisory.
- Infographic specification.
- Presentation specification/deck payload.
- Video package.

## Chosen implementation profile

| Area | Decision |
|---|---|
| Frontend | React + TypeScript + MUI + Redux Toolkit/RTK Query |
| Backend | Python + FastAPI + Pydantic + SQLAlchemy |
| Metadata DB | PostgreSQL |
| Vector search | pgvector behind a `VectorStore` abstraction |
| Cache/session | Redis |
| Async jobs | Celery + RabbitMQ |
| Object storage | S3-compatible API; MinIO locally |
| Auth | Firebase Auth token verification for MVP; adapter-based |
| AI providers | Claude primary, OpenAI secondary, provider abstraction |
| Embeddings | SBERT-compatible embedding adapter |
| Speech | Whisper-compatible transcription adapter |
| Realtime | WebSocket/SSE-compatible job event channel |
| Deployment | Docker Compose local; Kubernetes + Helm production path |
| CI/CD | GitHub Actions |

The proposal listed AgentDB/Pinecone/Weaviate as vector options. This pack uses pgvector for MVP simplicity while preserving a swap-ready adapter.

## How to use this pack

Start with [00_INDEX.md](./00_INDEX.md), then implement in the order shown in [28_IMPLEMENTATION_PLAN_BACKLOG.md](./28_IMPLEMENTATION_PLAN_BACKLOG.md).

Recommended first coding sequence:
1. Repo scaffold and environment.
2. Auth, workspace, source, job, output models.
3. Text/PDF ingestion.
4. AI model gateway.
5. Executive summary transformer.
6. LinkedIn transformer.
7. Twitter/X transformer.
8. Quality gate and evidence tracing.
9. Review/version workflow.
10. Downloads, webhook delivery, observability, tests.

## Documentation rules

- Every Markdown file is capped at 300 lines.
- Every file has navigation links to the index and neighboring documents.
- Requirements have stable IDs for traceability.
- API, data model, security, testing, deployment, and acceptance criteria are explicitly specified.

## Completion definition

Development may begin when:
- environment variables are provisioned,
- one primary LLM API key exists,
- the final cloud provider is either selected or local deployment is acceptable,
- the team accepts the MVP scope in [01_SOURCE_AND_SCOPE.md](./01_SOURCE_AND_SCOPE.md).

See [31_TRACEABILITY_VALIDATION.md](./31_TRACEABILITY_VALIDATION.md) for the documentation coverage and validation report.
