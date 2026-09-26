# Performance, SLO and Capacity

[Index](./00_INDEX.md) · [Previous](./25_LOCAL_SETUP_CONFIG.md) · [Next](./27_ACCEPTANCE_CRITERIA.md)

---


## Proposal-derived targets

- standard-document average transformation latency: <30 seconds,
- production hardening uptime: >99.5%,
- output quality >4.0/5 user evaluation,
- manual-correction error rate <2% target.

The latency target depends heavily on provider latency and source size, so measure by document class.

## Standard document definition

For P0 performance testing:
- up to 20 pages or ~15k source tokens,
- one P0 output format,
- no OCR/video,
- normal provider availability.

## Latency budget — transform job

Target example:
- queue wait: <2 s under normal load,
- context retrieval/build: <1 s,
- LLM generation: 5–20 s,
- quality checks: <5 s,
- persistence/rendering: <1 s.

P95 may exceed average target; report separately.

## API target

Non-AI API endpoints:
- p50 <150 ms,
- p95 <500 ms under demo-scale load,
excluding large file transfer and external network delays.

## Capacity assumption for MVP

Academic/demo baseline:
- 1k transformations/month,
- burst 5–10 concurrent users,
- 3 concurrent transformations/workspace default,
- 50 MB P0 upload limit,
- one PostgreSQL instance.

## Worker sizing

Separate pools:
- ingestion: CPU/memory moderate,
- transform: network-bound with provider concurrency limits,
- delivery: lightweight network I/O.

AI rate limits, not CPU, are expected to be the primary transform bottleneck.

## Backpressure

- reject or queue beyond per-workspace concurrency,
- expose queue status,
- enforce token/cost budget,
- pause low-priority jobs if provider throttle is active.

## Caching

Cache:
- source analysis by content hash,
- embeddings by content/model hash,
- prompt template resolution,
- brand profiles,
- optional provider prompt caching.

Do not cache user-edited outputs as if they were generated results.

## Database performance

- pagination required,
- avoid N+1 queries,
- indexes listed in [06_DOMAIN_AND_DATABASE.md](./06_DOMAIN_AND_DATABASE.md),
- use connection pooling,
- async DB access in API.

## Load test scenarios

1. 20 users reading dashboard/project lists.
2. 10 simultaneous text-source creates.
3. 20 queued transformation jobs.
4. 5 simultaneous webhook deliveries.
5. one large PDF near size limit.

## SLO measurement

Track separately:
- API availability,
- job completion success rate,
- queue wait,
- generation latency,
- end-to-end latency,
- provider-caused failure rate.

Do not claim >99.5% until production monitoring supports it.
