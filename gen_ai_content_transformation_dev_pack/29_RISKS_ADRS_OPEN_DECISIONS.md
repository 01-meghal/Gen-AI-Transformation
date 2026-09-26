# Risks, ADRs and Open Decisions

[Index](./00_INDEX.md) · [Previous](./28_IMPLEMENTATION_PLAN_BACKLOG.md) · [Next](./30_API_EXAMPLES_SEED_DATA.md)

---


## Risk register

| ID | Risk | Impact | Mitigation |
|---|---|---:|---|
| R-01 | LLM hallucination | High | claim/evidence grounding + human review |
| R-02 | Provider latency/rate limit | High | queue, retry, fallback, model routing |
| R-03 | Prompt injection | High | source isolation + detection + output leakage tests |
| R-04 | PII leakage | High | detect/redact policy + log hygiene |
| R-05 | URL SSRF | High | IP/redirect validation + allowlist controls |
| R-06 | Large-file latency | Medium | async processing + size limits + hierarchical context |
| R-07 | AI cost overrun | Medium | budgets, token limits, usage dashboard |
| R-08 | Scope creep | High | P0/P1 boundary and change control |
| R-09 | Single-developer bottleneck | Medium | modular monolith, vertical slices, automation |
| R-10 | Rapid model changes | Medium | AI gateway + regression evals |

## ADR-001 Modular monolith for P0

**Decision:** one FastAPI application with modular packages plus separate worker processes.

**Why:** proposal is a single-developer MVP; microservices would increase operational overhead without proving more product value.

**Consequence:** logical interfaces must remain extraction-ready.

## ADR-002 PostgreSQL + pgvector for MVP

**Decision:** use pgvector behind `VectorStore`.

**Why:** simpler local/demo operations than adding a separate vector database.

**Proposal note:** AgentDB/Pinecone/Weaviate remain future adapters.

## ADR-003 RabbitMQ + Celery

**Decision:** RabbitMQ queue with Celery workers for P0.

**Why:** explicit task/retry ecosystem and proposal alignment.

**Alternative:** Kafka only when streaming/throughput requirements justify it.

## ADR-004 Structured output first

**Decision:** transformers return schema-validated JSON before rendering.

**Why:** makes validation, editing, versioning, and multi-renderer support reliable.

## ADR-005 Evidence-grounded generation

**Decision:** transformations receive stable evidence IDs and quality checks validate factual blocks.

**Why:** proposal explicitly identifies hallucination risk and human review.

## ADR-006 Auth provider adapter

**Decision:** Firebase token verification for MVP with interface for future OIDC/SSO.

## ADR-007 Realtime DB authority

**Decision:** realtime events are hints; DB status remains authoritative.

## Open decisions — remaining <5% implementation inputs

### OD-01 Final primary model names
Owner: AI lead.
Needed before integration testing because provider model catalogs/pricing can change.

### OD-02 Production cloud
Choose AWS, GCP, or local/demo-only.
Core code remains S3-compatible and Kubernetes-compatible.

### OD-03 Retention policy
Decide source/output/audit retention for any real user deployment.

### OD-04 Exact platform limits
Centralize LinkedIn/X character/hashtag policies in configuration and confirm current connector/API constraints when publishing is enabled.

### OD-05 PII default mode
Recommended academic demo: `detect_only`; real deployments need risk-based decision.

### OD-06 Reviewer policy by domain
Decide whether all outputs or only warning/high-risk outputs require reviewer approval.

### OD-07 Brand visual rendering scope
P0 uses voice/text rules; full logo/font/color asset generation is P1 unless required for demo.

## Decision rule

No open decision above blocks backend/frontend scaffolding, data model, ingestion, AI gateway interfaces, transformer contracts, quality architecture, or test development.
