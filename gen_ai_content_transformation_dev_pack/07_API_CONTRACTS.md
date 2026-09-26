# API Contracts

[Index](./00_INDEX.md) · [Previous](./06_DOMAIN_AND_DATABASE.md) · [Next](./08_INGESTION_PIPELINE.md)

---


Base path: `/api/v1`

## Common conventions

- JSON uses `snake_case`.
- IDs are UUID strings.
- Timestamps are UTC ISO-8601.
- Protected calls require `Authorization: Bearer <token>`.
- Workspace context is path-scoped or header-scoped, never inferred from client-supplied object ownership.
- Collection endpoints use cursor pagination.
- Create endpoints support `Idempotency-Key` where duplicate creation is costly.
- Async operations return `202 Accepted` with job IDs.

## Error envelope

```json
{
  "error": {
    "code": "SOURCE_NOT_READY",
    "message": "The source is still processing.",
    "request_id": "req_...",
    "details": {}
  }
}
```

## Auth/workspace

### `GET /me`
Returns authenticated user and accessible workspaces.

### `GET /workspaces/{workspace_id}`
Returns workspace settings if authorized.

## Projects

### `POST /workspaces/{workspace_id}/projects`
Request: `name`, `description?`.

### `GET /workspaces/{workspace_id}/projects`
Filters: `cursor`, `limit`, `archived`.

### `GET /projects/{project_id}`
Returns project summary and counts.

## Sources

### `POST /projects/{project_id}/sources:text`
Request:
```json
{"title":"...","text":"...","metadata":{}}
```
Returns source + ingestion job.

### `POST /projects/{project_id}/sources:upload`
Multipart for small P0 files or presigned flow when enabled.
Accepted P0: txt, md, pdf, docx.

### `POST /projects/{project_id}/sources:url`
Request: `url`, optional `title`.
Server applies SSRF and allow/deny checks.

### `GET /sources/{source_id}`
Returns metadata, status, analysis summary.

### `GET /sources/{source_id}/blocks`
Paginated canonical blocks.

### `POST /sources/{source_id}:retry`
Retries failed ingestion after validation.

### `DELETE /sources/{source_id}`
Soft delete/tombstone by default.

## Transformations

### `POST /sources/{source_id}/transformations`
Request:
```json
{
  "targets": ["executive_summary", "linkedin_post"],
  "configuration": {
    "audience": "executives",
    "tone": "formal",
    "language": "en",
    "detail_level": "high_level",
    "objective": "inform",
    "content_style": "bullet_points",
    "brand_profile_id": null,
    "length_target": "medium",
    "fact_strictness": "high"
  }
}
```
Response: batch + job list.

### `GET /transformation-batches/{batch_id}`
Returns all target jobs and output links.

## Jobs

### `GET /jobs/{job_id}`
Returns status, progress, safe error, timestamps.

### `POST /jobs/{job_id}:cancel`
Best-effort cancellation for queued/running jobs.

## Outputs

### `GET /outputs/{output_id}`
Returns status + current version summary.

### `GET /outputs/{output_id}/versions`
Paginated version list.

### `GET /outputs/{output_id}/versions/{version_id}`
Returns content, rendered preview, quality report, evidence links, metadata.

### `POST /outputs/{output_id}/versions`
Creates user-edited version.
Request: prior version ID + updated structured content.

### `POST /outputs/{output_id}:regenerate`
Request includes optional instruction/config override.
Returns async job.

### `POST /outputs/{output_id}:regenerate-section`
Request:
- `base_version_id`,
- `section_path`,
- `instruction?`.

### `POST /outputs/{output_id}:submit-review`
Transitions current draft to review state.

### `POST /output-versions/{version_id}/reviews`
Request: `decision`, `comment?`.

## Downloads

### `GET /output-versions/{version_id}/download?format=md|txt|json`
Returns file or short-lived signed URL.

## Brands

### `GET/POST /workspaces/{workspace_id}/brand-profiles`
### `GET/PATCH /brand-profiles/{brand_profile_id}`

Brand validation must reject invalid visual token structure.

## Prompts

Admin-only:
- `GET /prompt-templates`
- `GET /prompt-templates/{id}/versions`
- `POST /prompt-templates/{id}/versions`
- `POST /prompt-versions/{id}:activate`

Activation must not mutate prior versions.

## Integrations/webhooks

- `GET/POST /workspaces/{workspace_id}/webhooks`
- `POST /webhooks/{id}:test`
- `POST /output-versions/{version_id}:deliver`
- `GET /deliveries/{delivery_id}`

## Audit/usage

- `GET /workspaces/{workspace_id}/audit-events`
- `GET /workspaces/{workspace_id}/usage`

Both are paginated and role-protected.

## Realtime

`GET /realtime` via WebSocket or SSE.
Subscribe with authorized workspace/project/job IDs.

Event envelope:
```json
{
  "type":"job.progress",
  "event_id":"...",
  "occurred_at":"...",
  "data":{"job_id":"...","status":"RUNNING","progress":55}
}
```

## API versioning

Breaking changes require `/v2` or explicit compatibility layer. Transformer schema revisions are versioned independently and stored with output versions.
