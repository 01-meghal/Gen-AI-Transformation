# Source Baseline and Scope

[Index](./00_INDEX.md) · [Previous](./00_INDEX.md) · [Next](./02_REQUIREMENTS.md)

---


## Source of truth

This specification is derived from the project proposal titled **“Gen AI Platform for Automated Content Transformation”**, SIH problem statement **26154**.

The proposal defines a platform that accepts diverse source content, analyzes meaning and context, and produces channel-specific outputs with configurable audience, tone, language, detail level, communication objective, style, and brand guidance.

## Proposal-aligned outcomes

The implementation must support:
- source ingestion and normalization,
- analysis/understanding,
- transformation orchestration,
- output rendering and quality assurance,
- configuration/management,
- real-time source-vs-output preview,
- inline editing and section regeneration,
- version history,
- human review checkpoints,
- downloadable output generation.

## MVP scope — P0

P0 is the minimum product that must work end to end.

### Inputs
- Direct text entry.
- `.txt` and Markdown.
- PDF.
- DOCX.
- URL ingestion for publicly accessible HTML.

### Core transformations
- Executive Summary.
- LinkedIn Post.
- Twitter/X Post or Thread.

### Core configuration
- audience,
- tone,
- language,
- level of detail,
- communication objective,
- content style,
- brand profile,
- output length target.

### Core platform functions
- authenticated user,
- workspace/project,
- upload/ingest source,
- async processing,
- real-time job status,
- source preview,
- generated preview,
- editable output,
- regenerate entire output or section,
- output version history,
- review/approve/reject,
- Markdown/text/JSON download,
- webhook delivery,
- audit events,
- usage/cost record.

## P1 scope — architecture ready, implementation after P0

- PPTX ingestion.
- JPG/PNG OCR and captioning.
- MP4/MOV transcription and scene metadata.
- Advisory transformer.
- Infographic specification transformer.
- Presentation transformer.
- Video package transformer.
- cloud-storage connectors,
- comment threads,
- social publishing,
- A/B variants,
- localization variants,
- advanced analytics.

## Explicit non-goals for P0

- Fully autonomous publishing without approval.
- Legal or medical decision-making.
- Guaranteed factual correctness beyond source-grounded validation.
- Training a foundation model from scratch.
- Custom billing/subscription platform.
- Full DAM replacement.
- Enterprise SSO beyond auth adapter hooks.
- High-scale Kafka topology.
- Multi-region active-active deployment.

## Key architecture constraint

The proposal calls for a modular five-layer architecture. P0 must preserve these logical boundaries even if deployed as a modular monolith plus workers.

## Scope interpretation for a single developer

Use a **modular monolith** for API/business logic plus separate async workers. Avoid premature microservices while keeping package interfaces compatible with later extraction.

## Proposal schedule interpretation

The proposal contains both:
- a four-week MVP/proof-of-concept work plan, and
- a separate 6–8 month cost-estimate note.

This pack treats the four-week plan as the academic MVP target and the longer duration as a hardening/expansion horizon rather than a conflicting runtime requirement.

## Product success targets inherited from the proposal

- target transformation time reduction: 70%+,
- target content reuse increase: 3–5x,
- target uptime: >99.5% after production hardening,
- target standard-document transformation latency: <30 seconds average,
- target user quality score: >4.0/5,
- target manual-correction error rate: <2%.

## Working assumptions

- English is the first fully tested language; localization interface is included.
- A source document normally fits within a bounded token/chunk budget; oversized sources use hierarchical summarization.
- Users own or are authorized to transform uploaded content.
- Source content is untrusted and may contain prompt injection.
- AI provider credentials are configured server-side only.

## Scope change rule

Any new format, integration, or compliance requirement must be added as:
1. a new requirement ID,
2. a schema/contract change,
3. test coverage,
4. traceability update in [31_TRACEABILITY_VALIDATION.md](./31_TRACEABILITY_VALIDATION.md).
