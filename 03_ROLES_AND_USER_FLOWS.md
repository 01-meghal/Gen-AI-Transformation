# Roles, Permissions and User Flows

[Index](./00_INDEX.md) · [Previous](./02_REQUIREMENTS.md) · [Next](./04_ARCHITECTURE.md)

---


## Roles

### Admin
- manage workspace settings,
- manage members and roles,
- manage brand profiles,
- manage prompt/template versions,
- manage integrations/webhooks,
- review usage/audit records,
- all Editor and Reviewer capabilities.

### Editor / Creator
- create projects,
- upload/ingest sources,
- configure transformations,
- generate/regenerate outputs,
- edit drafts,
- submit for review,
- download non-restricted outputs.

### Reviewer / Approver
- open review queue,
- compare source/evidence/output,
- comment,
- approve,
- request changes,
- reject,
- trigger delivery when permitted.

### Viewer
- read accessible projects/sources/approved outputs,
- download approved outputs if allowed,
- cannot edit, regenerate, or approve.

## Permission matrix

| Capability | Admin | Editor | Reviewer | Viewer |
|---|---:|---:|---:|---:|
| Create project/source | ✓ | ✓ |  |  |
| Run transform | ✓ | ✓ |  |  |
| Edit draft | ✓ | ✓ | optional |  |
| Submit review | ✓ | ✓ |  |  |
| Approve/reject | ✓ |  | ✓ |  |
| Manage prompt versions | ✓ |  |  |  |
| Manage brand profiles | ✓ | optional |  |  |
| Manage integrations | ✓ |  |  |  |
| View audit/usage | ✓ | limited | limited |  |
| Download approved | ✓ | ✓ | ✓ | ✓ |

## Primary flow: source → approved output

1. User authenticates.
2. User selects workspace/project.
3. User uploads a source or enters text/URL.
4. API creates source and ingestion job.
5. Worker validates, parses, normalizes, chunks, and analyzes source.
6. UI receives `SOURCE_READY` event.
7. User selects target format(s) and transformation configuration.
8. API creates transformation batch and jobs.
9. Orchestrator builds source context and calls transformer(s).
10. Structured result is schema-validated.
11. Quality pipeline checks grounding, format, style, safety, and brand rules.
12. If pass, output becomes `READY_FOR_REVIEW`.
13. User edits/regenerates as required.
14. User submits for review.
15. Reviewer approves or requests changes.
16. Approved version can be downloaded or delivered by webhook.
17. Audit and usage records remain queryable.

## Flow: section regeneration

1. Editor selects a section/component.
2. User supplies optional regeneration instruction.
3. API creates `REGENERATE_SECTION` job with parent version ID.
4. Orchestrator passes only relevant source evidence + full output context.
5. New section is generated and validated.
6. System creates a new output version containing unchanged sibling sections plus new section.
7. Diff is shown in UI.

## Flow: reviewer verification

Reviewer view must show:
- current output version,
- source excerpts/evidence supporting generated claims,
- quality scores/check results,
- previous version diff,
- model/provider metadata,
- comments and requested changes.

## Flow: failed ingestion

1. Source is created in `UPLOADING/QUEUED`.
2. Validation or parsing fails.
3. Source status becomes `FAILED` with safe user-facing error.
4. Technical error detail remains in logs only.
5. User can replace/retry source.

## Flow: failed generation

1. Job enters `RUNNING`.
2. Provider timeout/schema failure occurs.
3. Automatic retry policy executes.
4. If exhausted, job becomes `FAILED` and dead-letter record is created.
5. User can retry with same configuration; idempotency rules prevent duplicate versions from duplicate requests.

## State machines

### Source
`CREATED → VALIDATING → PROCESSING → READY | FAILED | DELETED`

### Transformation job
`QUEUED → RUNNING → VALIDATING → SUCCEEDED | FAILED | CANCELLED`

### Output
`DRAFT → READY_FOR_REVIEW → IN_REVIEW → CHANGES_REQUESTED → READY_FOR_REVIEW → APPROVED → DELIVERED`

`REJECTED` is terminal for that version but may be forked into a new draft version.

## UX safety principle

No automatic “publish” action may be hidden inside generation. Generate, review, approve, and deliver are separate user-visible operations.
