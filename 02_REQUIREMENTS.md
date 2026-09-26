# Requirements

[Index](./00_INDEX.md) · [Previous](./01_SOURCE_AND_SCOPE.md) · [Next](./03_ROLES_AND_USER_FLOWS.md)

---


Requirement IDs are stable and should be referenced in issues, PRs, tests, and acceptance criteria.

## Functional requirements

| ID | Requirement | Priority |
|---|---|---|
| FR-001 | User can authenticate and access authorized workspaces. | P0 |
| FR-002 | User can create and manage projects. | P0 |
| FR-003 | User can enter source text directly. | P0 |
| FR-004 | User can upload TXT/MD/PDF/DOCX. | P0 |
| FR-005 | User can ingest a permitted public URL. | P0 |
| FR-006 | System validates content type, size, integrity, and security. | P0 |
| FR-007 | System normalizes source content into canonical blocks/chunks. | P0 |
| FR-008 | System detects language and extracts document metadata. | P0 |
| FR-009 | System extracts entities, topics, claims, and evidence spans. | P0 |
| FR-010 | System stores searchable source embeddings. | P0 |
| FR-011 | User can choose one or more output formats. | P0 |
| FR-012 | User can configure audience. | P0 |
| FR-013 | User can configure tone. | P0 |
| FR-014 | User can configure language/localization target. | P0 |
| FR-015 | User can configure detail level. | P0 |
| FR-016 | User can configure communication objective. | P0 |
| FR-017 | User can configure content style. | P0 |
| FR-018 | User can apply a brand profile. | P0 |
| FR-019 | System generates an Executive Summary. | P0 |
| FR-020 | System generates a LinkedIn Post. | P0 |
| FR-021 | System generates an X post/thread with character validation. | P0 |
| FR-022 | System can generate multiple requested outputs from one source. | P0 |
| FR-023 | UI shows source and generated output side by side. | P0 |
| FR-024 | User can edit output inline. | P0 |
| FR-025 | User can regenerate full output. | P0 |
| FR-026 | User can regenerate a selected section with instructions. | P0 |
| FR-027 | System maintains immutable output versions. | P0 |
| FR-028 | Reviewer can approve, request changes, or reject. | P0 |
| FR-029 | System records audit events for material actions. | P0 |
| FR-030 | User can download Markdown, TXT, and JSON outputs. | P0 |
| FR-031 | System can POST approved output to configured webhooks. | P0 |
| FR-032 | System exposes async job progress and completion events. | P0 |
| FR-033 | System runs format, length, grounding, and brand checks. | P0 |
| FR-034 | System records AI usage, latency, provider, and estimated cost. | P0 |
| FR-035 | Admin can manage brand profiles. | P0 |
| FR-036 | Admin can manage prompt/template versions. | P0 |
| FR-037 | Admin can view audit and usage records. | P0 |
| FR-038 | System supports PPTX ingestion. | P1 |
| FR-039 | System supports JPG/PNG OCR/captioning. | P1 |
| FR-040 | System supports MP4/MOV transcription/scene metadata. | P1 |
| FR-041 | System generates Advisory outputs. | P1 |
| FR-042 | System generates Infographic specifications. | P1 |
| FR-043 | System generates Presentation payloads/decks. | P1 |
| FR-044 | System generates Video packages. | P1 |
| FR-045 | System supports comments and threaded collaboration. | P1 |
| FR-046 | System supports cloud storage connectors. | P1 |
| FR-047 | System supports publishing connectors. | P1 |
| FR-048 | System supports A/B and localization variants. | P1 |

## Non-functional requirements

| ID | Requirement | Target |
|---|---|---|
| NFR-001 | API authorization on every protected endpoint. | 100% |
| NFR-002 | Encryption in transit. | TLS 1.2+ |
| NFR-003 | Sensitive secrets never stored in source control. | 100% |
| NFR-004 | Production data encrypted at rest using platform controls. | Required |
| NFR-005 | Standard transformation average latency. | <30 s target |
| NFR-006 | Production hardening uptime. | >99.5% |
| NFR-007 | API p95 excluding AI generation. | <500 ms target |
| NFR-008 | Manual-correction rate after evaluation. | <2% target |
| NFR-009 | User quality rating. | >4.0/5 target |
| NFR-010 | Every AI output records prompt/model metadata. | 100% |
| NFR-011 | Every approval/status change is auditable. | 100% |
| NFR-012 | Jobs are idempotent for same idempotency key. | Required |
| NFR-013 | Failed async jobs are retryable or dead-lettered. | Required |
| NFR-014 | File and URL ingestion treats content as untrusted. | Required |
| NFR-015 | Prompt injection from source must not override system rules. | Required |
| NFR-016 | PII scan occurs before external AI calls when enabled. | Required |
| NFR-017 | Key database queries have indexes and pagination. | Required |
| NFR-018 | Code has automated unit/integration/E2E coverage. | Required |
| NFR-019 | Structured logs include correlation/job IDs. | Required |
| NFR-020 | Architecture supports provider/model substitution. | Required |

## Business rules

- BR-001: Only approved or sufficiently authorized users can send delivery webhooks.
- BR-002: Source deletion must cascade or tombstone derived embeddings according to retention policy.
- BR-003: Regeneration creates a new output version; it does not mutate historical versions.
- BR-004: User edits create a new version before approval.
- BR-005: Approved versions are immutable; further edits fork a new draft version.
- BR-006: A failed critical quality gate prevents `APPROVED` until resolved or explicitly overridden by an authorized role.
- BR-007: High-risk prompt injection or malware findings block processing.
- BR-008: Twitter/X single-post mode must enforce configured character limits before approval.
- BR-009: Model output must validate against transformer schema before persistence as `READY_FOR_REVIEW`.
- BR-010: Every external delivery is signed and produces a delivery-attempt record.

## Requirement change control

Any change to a requirement must update:
- [07_API_CONTRACTS.md](./07_API_CONTRACTS.md) if API-visible,
- [06_DOMAIN_AND_DATABASE.md](./06_DOMAIN_AND_DATABASE.md) if data-visible,
- [23_TESTING_EVALUATION.md](./23_TESTING_EVALUATION.md),
- [27_ACCEPTANCE_CRITERIA.md](./27_ACCEPTANCE_CRITERIA.md),
- [31_TRACEABILITY_VALIDATION.md](./31_TRACEABILITY_VALIDATION.md).
