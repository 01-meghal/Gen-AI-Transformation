# Documentation Index

[README](./README.md) · [Next](./01_SOURCE_AND_SCOPE.md)

---


## Product and requirements

- [01 Source and Scope](./01_SOURCE_AND_SCOPE.md) — proposal baseline, MVP boundary, assumptions, non-goals.
- [02 Requirements](./02_REQUIREMENTS.md) — functional and non-functional requirement IDs.
- [03 Roles and User Flows](./03_ROLES_AND_USER_FLOWS.md) — personas, RBAC, end-to-end flows.

## Architecture and implementation contracts

- [04 Architecture](./04_ARCHITECTURE.md) — five-layer architecture, request/data flow, topology.
- [05 Repository and Service Boundaries](./05_REPOSITORY_AND_SERVICE_BOUNDARIES.md) — code layout and module ownership.
- [06 Domain and Database](./06_DOMAIN_AND_DATABASE.md) — entities, tables, keys, indexes, lifecycle.
- [07 API Contracts](./07_API_CONTRACTS.md) — endpoints, request/response contracts, pagination, idempotency.
- [08 Ingestion Pipeline](./08_INGESTION_PIPELINE.md) — adapters, normalization, chunking, validation.
- [09 Analysis and Understanding](./09_ANALYSIS_UNDERSTANDING.md) — claims, entities, topics, multimodal analysis.
- [10 AI Model Gateway](./10_AI_MODEL_GATEWAY.md) — provider abstraction, routing, retries, structured outputs.
- [11 Transformation Orchestrator](./11_TRANSFORMATION_ORCHESTRATOR.md) — job graph, transformer selection, lifecycle.
- [12 Transformer Output Schemas](./12_TRANSFORMER_OUTPUT_SCHEMAS.md) — strict output shapes for every format.
- [13 Prompt Management](./13_PROMPT_MANAGEMENT.md) — prompt registry, variables, versions, safety separation.
- [14 Quality, Safety and Guardrails](./14_QUALITY_SAFETY_GUARDRAILS.md) — grounding, PII, prompt injection, validation.
- [15 Output Rendering and Delivery](./15_OUTPUT_RENDERING_DELIVERY.md) — renderers, packages, webhooks, downloads.
- [16 Review, Versioning and Collaboration](./16_REVIEW_VERSIONING_COLLAB.md) — approvals, comments, versions, audit.
- [17 Frontend UX](./17_FRONTEND_UX.md) — route map, screens, state, component contracts.
- [18 Async and Realtime Jobs](./18_ASYNC_REALTIME_JOBS.md) — queues, retries, events, workers.
- [19 Storage and Vector Search](./19_STORAGE_VECTOR_SEARCH.md) — object keys, DB/vector strategy, retention.

## Engineering quality

- [20 Security and Privacy](./20_SECURITY_PRIVACY.md) — threat model and controls.
- [21 Observability and Cost Control](./21_OBSERVABILITY_COST_CONTROL.md) — logs, metrics, traces, usage accounting.
- [22 Error Handling and Resilience](./22_ERROR_HANDLING_RESILIENCE.md) — error taxonomy, retry policy, recovery.
- [23 Testing and Evaluation](./23_TESTING_EVALUATION.md) — unit, integration, E2E, prompt evals, golden set.
- [24 DevOps, CI/CD and Deployment](./24_DEVOPS_CICD_DEPLOYMENT.md) — pipelines, Docker, Helm, environments.
- [25 Local Setup and Configuration](./25_LOCAL_SETUP_CONFIG.md) — developer bootstrap and environment variables.
- [26 Performance, SLO and Capacity](./26_PERFORMANCE_SLO_CAPACITY.md) — latency budgets, capacity assumptions.

## Delivery control

- [27 Acceptance Criteria](./27_ACCEPTANCE_CRITERIA.md) — feature-level Definition of Acceptance.
- [28 Implementation Plan and Backlog](./28_IMPLEMENTATION_PLAN_BACKLOG.md) — sprint order and issue breakdown.
- [29 Risks, ADRs and Open Decisions](./29_RISKS_ADRS_OPEN_DECISIONS.md) — resolved choices and the remaining <5% decisions.
- [30 API Examples and Seed Data](./30_API_EXAMPLES_SEED_DATA.md) — concrete payloads and fixtures.
- [31 Traceability and Validation](./31_TRACEABILITY_VALIDATION.md) — proposal-to-spec mapping and line/link checks.

## Development start point

Read 01 → 04 → 06 → 07 → 10 → 11 → 12 → 14 → 28, then scaffold the repository.
