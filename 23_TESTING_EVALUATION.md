# Testing and AI Evaluation Strategy

[Index](./00_INDEX.md) · [Previous](./22_ERROR_HANDLING_RESILIENCE.md) · [Next](./24_DEVOPS_CICD_DEPLOYMENT.md)

---


## Test pyramid

### Unit tests
Cover:
- config validation,
- RBAC rules,
- chunking,
- schema validation,
- renderer formatting,
- platform limits,
- quality scoring,
- cost calculation,
- state transitions.

Target: high coverage on deterministic business logic.

### Integration tests
Use real PostgreSQL/Redis/RabbitMQ/MinIO containers where practical.
Cover:
- repositories/migrations,
- upload → ingestion,
- transformation job persistence,
- provider adapter mocks,
- webhook signatures/retries.

### API contract tests
- request validation,
- error envelope,
- authorization,
- pagination,
- idempotency,
- OpenAPI schema drift.

### E2E tests
Cypress per proposal.
Critical flows:
1. login → create project → add text source.
2. source ready → generate summary.
3. generate LinkedIn + X.
4. edit → save new version.
5. submit → reviewer approves.
6. download approved output.
7. webhook delivery test.

## AI golden set

Create at least 30 source fixtures across:
- news,
- corporate report,
- policy document,
- research abstract/paper excerpt,
- security/incident text,
- marketing content.

For each fixture define:
- important facts/claims,
- prohibited inventions,
- expected structural fields,
- preferred evidence IDs,
- platform constraints.

## Evaluation metrics

### Structural
- JSON/schema pass rate,
- required fields,
- character/word limits.

### Grounding
- claim support rate,
- numeric/date consistency,
- attribution preservation.

### Quality
- human rating 1–5,
- clarity,
- usefulness,
- style fit.

### Efficiency
- latency,
- input/output tokens,
- estimated cost.

## Release gate for prompt/model changes

A new active prompt/model mapping should not ship if it causes a material regression in:
- schema pass,
- grounding,
- critical fact consistency,
- platform compliance.

Define project-specific tolerance after baseline run; default zero tolerance for critical factual regressions.

## Adversarial tests

Include sources containing:
- “ignore previous instructions”,
- fake system prompt,
- secret-exfiltration instructions,
- HTML/JS injection,
- private IP URLs,
- huge repeated text,
- contradictory claims,
- sensitive identifiers.

## Performance tests

- concurrent text transformations,
- 10–50 queued jobs,
- large PDF within supported size,
- vector search latency,
- webhook retry load.

## Test data safety

Use synthetic or licensed fixtures.
Do not commit customer-sensitive documents.

## CI test stages

PR:
- lint/typecheck,
- unit,
- lightweight integration,
- security scans.

Main/staging:
- full integration,
- E2E,
- selected AI golden eval using controlled budget.

Nightly/weekly:
- broader prompt/model evaluation,
- dependency/container scans.
