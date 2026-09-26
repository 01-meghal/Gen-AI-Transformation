# Implementation Plan and Backlog

[Index](./00_INDEX.md) · [Previous](./27_ACCEPTANCE_CRITERIA.md) · [Next](./29_RISKS_ADRS_OPEN_DECISIONS.md)

---


## Strategy

Implement vertical slices that end in demonstrable user value.
The proposal’s four-week plan is preserved but made engineering-specific.

## Week 1 — Foundation and ingestion

### EPIC-01 Repository and environment
- scaffold monorepo,
- Docker Compose dependencies,
- CI lint/type/unit skeleton,
- settings/secrets loader,
- health endpoints.

### EPIC-02 Auth/workspace/project
- Firebase verifier + local fake auth,
- User/Workspace/Member/Project tables,
- RBAC middleware/dependencies,
- project APIs.

### EPIC-03 Source ingestion
- Source/Block/Chunk models,
- text/TXT/MD adapter,
- PDF adapter,
- DOCX adapter,
- URL adapter + SSRF defense,
- object storage,
- ingestion queue/job progress.

### Week-1 exit
Text/PDF/DOCX/URL source reaches `READY` with preview.

## Week 2 — AI core and two transformers

### EPIC-04 Analysis layer
- language detection,
- key topics,
- claim/evidence extraction,
- embeddings/pgvector,
- retrieval context builder.

### EPIC-05 AI gateway
- provider interface,
- Anthropic adapter,
- OpenAI fallback adapter,
- structured generation,
- token/cost records,
- retry/rate limiting.

### EPIC-06 Executive Summary
- schema,
- prompt v1,
- quality checks,
- renderer,
- API/UI integration.

### EPIC-07 LinkedIn Post
Same vertical slice pattern.

### Week-2 exit
User can generate, preview, edit, and download two formats.

## Week 3 — X, review, versions, webhook

### EPIC-08 X transformer
- single/thread,
- character validation,
- prompt/evals.

### EPIC-09 Versioning/review
- immutable versions,
- edit save,
- full/section regeneration,
- submit/review decisions,
- audit.

### EPIC-10 Delivery
- Markdown/TXT/JSON downloads,
- webhook endpoints,
- HMAC signatures,
- retry worker.

### Week-3 exit
Complete generate → review → approve → deliver flow.

## Week 4 — Hardening, testing, presentation

### EPIC-11 Security
- file/URL hardening,
- rate limits,
- prompt injection tests,
- log redaction,
- permission test matrix.

### EPIC-12 Observability
- structured logs,
- metrics,
- basic Grafana dashboards,
- cost view.

### EPIC-13 Test/evaluation
- full integration suite,
- Cypress critical flows,
- 30-case golden set,
- prompt/model baseline.

### EPIC-14 Documentation/demo
- API docs,
- user guide,
- sample data,
- demo script,
- final performance/quality report.

## P1 backlog after academic MVP

- PPTX ingestion.
- Image OCR/captioning.
- Video/audio transcription.
- Advisory transformer.
- Infographic transformer.
- Presentation renderer.
- Video package transformer.
- threaded comments.
- social publishing connectors.
- cloud storage connectors.
- A/B prompt experiments.
- advanced analytics.

## Ticket template

Every implementation ticket should contain:
- linked requirement IDs,
- API/data changes,
- security considerations,
- tests,
- acceptance criteria,
- observability changes,
- migration/deployment notes.

## Critical path

Do not block P0 on:
- Kubernetes cluster,
- advanced multimodal models,
- social media publishing,
- enterprise SSO,
- full ELK stack.

These can be added after the complete P0 vertical flow is proven.
