# Review, Versioning and Collaboration

[Index](./00_INDEX.md) · [Previous](./15_OUTPUT_RENDERING_DELIVERY.md) · [Next](./17_FRONTEND_UX.md)

---


## Versioning model

Every output edit/regeneration creates an immutable `OutputVersion`.
`Output.current_version_id` points to the latest active working version.

## Version origins

- `ai` — first generation or full regeneration.
- `regeneration` — section regeneration.
- `user_edit` — manual edit saved by editor/reviewer.

## Version metadata

Store:
- creator/actor,
- timestamp,
- base version ID,
- prompt version/model metadata if AI-origin,
- configuration snapshot,
- quality report,
- change summary optional.

## Review states

`DRAFT → READY_FOR_REVIEW → IN_REVIEW → APPROVED`

Alternative transitions:
- `IN_REVIEW → CHANGES_REQUESTED → DRAFT/READY_FOR_REVIEW`
- `IN_REVIEW → REJECTED`

## Approval rules

- Only Reviewer/Admin can approve by default.
- Approved version is immutable.
- Critical quality failure must be resolved or explicitly overridden with permission and reason.
- Approval stores exact version ID, not just output ID.

## Diff

For structured content:
- compare field/path changes,
- show added/removed/changed list items,
- show text-level diff within changed fields.

Do not diff rendered HTML as primary source of truth.

## Comments

P1 full threads; P0 may implement simple review comment.

Comment anchor can reference:
- JSON path,
- character range,
- section ID,
- evidence ID.

## Section regeneration UX

Show:
- selected section,
- optional instruction,
- evidence used,
- before/after diff,
- new quality results.

## Concurrency

Use optimistic concurrency:
- client sends base/current version ID,
- server rejects stale edit with `409 VERSION_CONFLICT`,
- user reloads/merges.

## Audit events

Record:
- output generated,
- output edited,
- regeneration requested/completed,
- review submitted,
- approval/changes requested/rejection,
- quality override,
- delivery requested/result.

## Feedback loop

User rating/correction can be stored as structured feedback:
- usefulness 1–5,
- factuality 1–5,
- style 1–5,
- free-text note,
- changed fields.

Feedback is evaluation data; it must not silently modify prompts without a controlled prompt-version change.
