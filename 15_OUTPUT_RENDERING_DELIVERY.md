# Output Rendering and Delivery

[Index](./00_INDEX.md) · [Previous](./14_QUALITY_SAFETY_GUARDRAILS.md) · [Next](./16_REVIEW_VERSIONING_COLLAB.md)

---


## Separation of concerns

Transformer returns structured content.
Renderer converts structured content into presentation/delivery forms.

## P0 renderers

### Markdown
Human-readable and portable.

### Plain text
Social posts and simple summaries.

### JSON
Full structured artifact including schema version and optional evidence map.

### HTML preview
Frontend may render directly from structured data; backend HTML export is optional P0.

## P1 renderers

- PPTX deck,
- infographic SVG/PNG specification pipeline,
- advisory PDF/HTML,
- video package ZIP/JSON,
- social connector payloads.

## Rendering rules

- escape/sanitize HTML,
- never trust model-supplied URLs without validation,
- recalculate counts,
- apply brand style after factual content generation,
- include generated-at metadata only when requested,
- keep internal IDs out of public text unless evidence/citation mode requires them.

## Download package

For JSON package, include:
```text
manifest.json
output.json
output.md
source_map.json        # optional, permission-controlled
quality_report.json    # optional, permission-controlled
```

P0 may deliver individual files instead of ZIP when one output is requested.

## Object key convention

```text
workspaces/{workspace_id}/projects/{project_id}/outputs/{output_id}/v{version}/{filename}
```

Use immutable versioned keys.

## Webhook delivery

Webhook event types:
- `output.approved`,
- `output.delivered`,
- `transformation.completed`,
- `transformation.failed`.

Payload includes:
- event ID,
- timestamp,
- workspace ID,
- resource IDs,
- output type,
- version,
- download link or embedded content depending endpoint policy.

## Signature

Sign request body with HMAC SHA-256 using endpoint secret.
Headers:
- `X-Content-Event-Id`,
- `X-Content-Timestamp`,
- `X-Content-Signature`.

Receiver can prevent replay using timestamp + event ID.

## Delivery retries

Retry transient failures:
- network errors,
- 408,
- 429,
- 5xx.

Do not auto-retry most 4xx configuration failures.
Default schedule: immediate, 1m, 5m, 30m, 2h; configurable.

## Email/social publishing

P1 only unless credentials/integration requirements are finalized.
Generation must remain decoupled from publishing.

## Approved immutability

Delivery always references an immutable approved output version.
If content changes, it must be approved as a new version before delivery.
