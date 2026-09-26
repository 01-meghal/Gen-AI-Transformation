# Async Processing and Realtime Jobs

[Index](./00_INDEX.md) · [Previous](./17_FRONTEND_UX.md) · [Next](./19_STORAGE_VECTOR_SEARCH.md)

---


## Queue topology

RabbitMQ exchanges/queues:
- `ingestion.default`,
- `transform.default`,
- `delivery.default`,
- `dead_letter`.

Workers may have separate concurrency limits.

## Job types

- `INGEST_SOURCE`,
- `ANALYZE_SOURCE`,
- `TRANSFORM_OUTPUT`,
- `REGENERATE_OUTPUT`,
- `REGENERATE_SECTION`,
- `RENDER_OUTPUT`,
- `DELIVER_WEBHOOK`.

## Job fields

- job ID,
- workspace ID,
- type,
- resource IDs,
- status,
- progress 0–100,
- attempt count,
- idempotency key,
- safe error,
- timestamps,
- stage metadata.

## Progress guidance

Example transform percentages:
- 5 load context,
- 20 retrieve evidence,
- 35 resolve prompt/model,
- 60 generation returned,
- 75 schema validated,
- 90 quality checks,
- 100 persisted/rendered.

Progress is informative, not exact time estimate.

## Retry policy

### Ingestion
Retry transient object-store/network issues; parsing errors generally fail without retry unless parser crash is transient.

### Transformation
Provider transient retry within gateway, then task retry once if safe.

### Delivery
Dedicated retry schedule in [15_OUTPUT_RENDERING_DELIVERY.md](./15_OUTPUT_RENDERING_DELIVERY.md).

## Dead-letter handling

After terminal failure:
- job status `FAILED`,
- compact safe error persisted,
- message/details in dead-letter queue or failure store,
- alert metric incremented,
- manual retry endpoint available when appropriate.

## Idempotency

Task handlers use a distributed/job-stage lock.
Before creating output version, worker checks whether stage result already exists for same job attempt key.

## Cancellation

- queued jobs can be cancelled reliably,
- running model calls are best-effort cancellation,
- if provider call cannot be stopped, result is discarded when job is marked cancelled.

## Realtime transport

Preferred: WebSocket for interactive dashboard.
SSE is acceptable fallback.

## Event types

- `source.progress`,
- `source.ready`,
- `source.failed`,
- `job.progress`,
- `job.completed`,
- `job.failed`,
- `output.version_created`,
- `output.review_state_changed`,
- `delivery.completed`,
- `delivery.failed`.

## Realtime authorization

- socket authenticated with short-lived token,
- subscriptions limited to authorized workspace/project/resource IDs,
- event payloads contain no raw source content by default.

## Reconnect

Client stores last event ID when supported and re-fetches canonical job state after reconnect.
DB state is authoritative over missed events.
