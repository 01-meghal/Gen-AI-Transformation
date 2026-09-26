# Acceptance Criteria

[Index](./00_INDEX.md) · [Previous](./26_PERFORMANCE_SLO_CAPACITY.md) · [Next](./28_IMPLEMENTATION_PLAN_BACKLOG.md)

---


## AC-01 Authentication and workspace isolation

Given two workspaces, a user from workspace A cannot read or mutate workspace B resources by guessing IDs.

## AC-02 Project/source creation

Editor can create a project, enter text, upload PDF/DOCX/TXT/MD, or submit an allowed URL.
Invalid media type/size returns a safe error.

## AC-03 Ingestion readiness

A valid source transitions to `READY` and exposes normalized preview plus analysis metadata.
Failed source shows retryable/non-retryable status.

## AC-04 Executive summary generation

From a READY source, user can generate an executive summary that:
- validates against schema,
- includes source-grounded key findings,
- passes configured hard quality checks,
- stores model/prompt metadata.

## AC-05 LinkedIn generation

Generates structured LinkedIn output with hook/body/optional CTA/hashtags and server-calculated count.

## AC-06 X generation

Generates single post or thread according to configuration and every post satisfies configured hard character limit before approval.

## AC-07 Multi-format batch

User can request at least two P0 formats from one source; each job completes independently and one failure does not erase a successful sibling output.

## AC-08 Realtime progress

UI shows job/source progress and refreshes canonical state on completion/reconnect.

## AC-09 Inline edit/versioning

Saving an edit creates a new immutable version; prior version remains viewable.

## AC-10 Regeneration

Full regeneration and section regeneration create new versions and preserve base version references.

## AC-11 Quality visibility

Output detail displays pass/warn/fail checks and blocking reasons.

## AC-12 Review workflow

Editor submits for review; reviewer can approve/request changes/reject; every decision is version-specific and audited.

## AC-13 Approved immutability

Approved version cannot be edited in place.
Editing forks a new draft version.

## AC-14 Downloads

Authorized user can download approved/current permitted version as Markdown, TXT, or JSON.

## AC-15 Webhook delivery

Approved output can be delivered to configured endpoint with signed payload; attempt and retry status are recorded.

## AC-16 Prompt management

Admin can create a new prompt version, validate it, activate it, and historical output continues referencing the exact original version.

## AC-17 Brand profiles

Admin can define voice/term rules and selected brand profile affects generation/quality checks without changing source facts.

## AC-18 Audit

Material actions listed in [16_REVIEW_VERSIONING_COLLAB.md](./16_REVIEW_VERSIONING_COLLAB.md) produce queryable audit events.

## AC-19 Security

- private URL targets blocked,
- cross-workspace access tests pass,
- unsafe HTML does not execute,
- raw source is not placed into system prompt,
- secrets absent from logs.

## AC-20 AI regression suite

All P0 transformers pass the release threshold on the golden evaluation set.

## AC-21 Error recovery

Transient provider failure retries; exhausted failure produces safe user-visible job error and allows manual retry.

## AC-22 Observability

A transformation can be traced using request/job IDs across API, queue, AI call metadata, output version, and usage record.

## AC-23 Local deployment

Fresh developer can start required local infrastructure from documented setup and complete text → summary smoke test.

## AC-24 Documentation traceability

Each P0 functional requirement maps to implementation module and at least one test/acceptance item.

## MVP release decision

P0 is demo-ready only when AC-01 through AC-24 pass or any deliberate exception is documented with owner and rationale.
