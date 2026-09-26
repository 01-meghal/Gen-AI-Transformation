# Observability and Cost Control

[Index](./00_INDEX.md) · [Previous](./20_SECURITY_PRIVACY.md) · [Next](./22_ERROR_HANDLING_RESILIENCE.md)

---


## Correlation identifiers

Every inbound request gets `request_id`.
Every async task has `job_id`.
Model calls include both when available.

## Structured logs

Minimum fields:
- timestamp,
- level,
- service,
- environment,
- request_id,
- job_id,
- workspace_id,
- user_id where appropriate,
- event/message,
- error_code,
- duration_ms.

Never log raw secrets/source content.

## Metrics

### API
- request count by route/status,
- latency histogram,
- auth failures,
- rate-limit rejects.

### Jobs
- queued/running/succeeded/failed,
- queue wait time,
- execution duration,
- retry count,
- dead-letter count.

### AI
- calls by provider/model,
- token usage,
- latency,
- schema-failure rate,
- provider error rate,
- fallback rate,
- estimated cost.

### Quality
- pass/warn/fail by transformer,
- grounding score distribution,
- user rating,
- edit distance/manual correction proxy.

### Delivery
- attempts,
- success rate,
- retry count,
- endpoint latency.

## Tracing

Use OpenTelemetry-compatible spans:
- HTTP request,
- DB query group,
- enqueue/dequeue,
- ingestion stages,
- AI provider call,
- quality pipeline,
- rendering/delivery.

## Dashboards

P0 dashboard set:
1. API health.
2. Job/queue health.
3. AI usage/cost.
4. Transformation quality.

Prometheus + Grafana aligns with proposal.
ELK/OpenSearch is optional if JSON logs are already centrally available.

## Alerts

Examples:
- API 5xx > threshold,
- job failure rate spike,
- queue age exceeds threshold,
- provider 429/5xx spike,
- daily AI cost exceeds budget,
- webhook failure burst,
- DB connection saturation.

## Cost controls

- workspace monthly token/cost budget,
- per-job max token budget,
- model alias routing by task complexity,
- prompt/context caching where provider supports it,
- reuse analysis results,
- avoid repeated embeddings for same hash,
- truncate/regroup context by importance.

## Usage report

Admin view aggregates:
- transformations,
- input/output tokens,
- estimated AI cost,
- average latency,
- format mix,
- failure rate.

Prices are configuration, not code constants.
Store price table version with cost estimate metadata.
