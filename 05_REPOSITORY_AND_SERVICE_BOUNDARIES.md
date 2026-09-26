# Repository Structure and Service Boundaries

[Index](./00_INDEX.md) · [Previous](./04_ARCHITECTURE.md) · [Next](./06_DOMAIN_AND_DATABASE.md)

---


## Monorepo layout

```text
repo/
  apps/
    api/
    web/
    worker/
  packages/
    py/
      domain/
      application/
      infrastructure/
      ai/
      ingestion/
      transformers/
      quality/
      renderers/
    ts/
      api-client/
      ui-types/
  infra/
    docker/
    helm/
    monitoring/
  migrations/
  tests/
    unit/
    integration/
    e2e/
    evals/
    fixtures/
  docs/
  scripts/
  .github/workflows/
```

## Backend packages

### `domain`
Pure business types and enums:
- WorkspaceId, UserId, SourceId, JobId, OutputId.
- SourceStatus, JobStatus, OutputStatus.
- TransformationType.
- ReviewDecision.
- domain exceptions.

No framework/provider imports.

### `application`
Use cases:
- create source,
- start ingestion,
- create transformation,
- regenerate section,
- submit review,
- review output,
- deliver output,
- query audit/usage.

Defines ports/interfaces:
- `SourceRepository`,
- `OutputRepository`,
- `JobRepository`,
- `ObjectStore`,
- `VectorStore`,
- `LLMProvider`,
- `EventPublisher`,
- `WebhookSender`.

### `infrastructure`
Adapters:
- SQLAlchemy repositories,
- S3/MinIO,
- pgvector,
- Redis,
- RabbitMQ/Celery,
- Firebase verifier,
- HTTP webhook client.

### `ai`
- provider router,
- provider SDK adapters,
- structured generation helper,
- token/cost accounting,
- retry/rate-limit logic,
- model registry.

### `ingestion`
- format adapter interface,
- PDF/DOCX/text/HTML adapters,
- normalization,
- chunking,
- language/metadata extraction,
- security scanning hooks.

### `transformers`
- base transformer protocol,
- executive summary,
- LinkedIn,
- X/thread,
- P1 transformer stubs/contracts.

### `quality`
- schema check,
- length/platform check,
- grounding check,
- brand check,
- PII/safety check,
- score aggregation.

### `renderers`
- Markdown,
- TXT,
- JSON,
- HTML optional,
- P1 PPTX/infographic assets.

## API app responsibilities

- HTTP routing,
- auth/RBAC,
- request validation,
- use-case invocation,
- serialization,
- presigned upload/download URLs,
- realtime connection authorization.

It must not contain prompt text or provider SDK logic.

## Worker app responsibilities

Three queues:
- `ingestion`,
- `transform`,
- `delivery`.

Worker imports application use cases plus infrastructure adapters.

## Web app structure

```text
apps/web/src/
  app/
  routes/
  features/
    auth/
    projects/
    sources/
    transformations/
    outputs/
    reviews/
    brands/
    prompts/
    integrations/
    audit/
  components/
  services/
  store/
  types/
```

## Shared API client

Generate or maintain TypeScript types from OpenAPI.
Do not duplicate request/response interfaces manually if generation is available.

## Naming rules

- snake_case in API JSON and database columns.
- PascalCase for Python/TypeScript types.
- kebab-case for frontend route segments.
- UUIDs exposed as strings.
- timestamps are UTC ISO-8601.

## Service boundary rule

Cross-module actions go through application use cases or defined interfaces, never direct DB access from unrelated modules.

## Dependency tests

Add an architecture test ensuring:
- domain imports no FastAPI/SQLAlchemy/provider SDK,
- transformers call AI only through gateway,
- API does not import provider implementations directly.
