# Storage, Object Keys and Vector Search

[Index](./00_INDEX.md) · [Previous](./18_ASYNC_REALTIME_JOBS.md) · [Next](./20_SECURITY_PRIVACY.md)

---


## Storage classes

### PostgreSQL
Stores transactional metadata, normalized text blocks/chunks, output versions, reviews, audit, usage, and pgvector embeddings.

### Object storage
Stores original files and rendered/download artifacts.

### Redis
Stores short-lived cache, rate-limit counters, distributed locks, and optional realtime pub/sub support.

## Object storage keys

```text
workspaces/{wid}/projects/{pid}/sources/{sid}/original/{sanitized_name}
workspaces/{wid}/projects/{pid}/sources/{sid}/derived/{asset}
workspaces/{wid}/projects/{pid}/outputs/{oid}/v{n}/{artifact}
```

No secret/user email in object keys.

## Object metadata

Record:
- SHA-256,
- content type,
- bytes,
- created time,
- source/output version association,
- retention class.

## Presigned URLs

- short TTL,
- workspace authorization before issue,
- upload content-type/size restrictions,
- download only for authorized user.

## Vector-store abstraction

```text
upsert(chunks)
search(workspace_id, source_ids, query_vector, top_k, filters)
delete_source(source_id)
health()
```

## P0 vector implementation

Use pgvector to reduce infrastructure.

Rationale:
- same transactional database,
- easy local development,
- sufficient MVP scale,
- HNSW index available,
- adapter allows later replacement.

## Proposal compatibility

The proposal lists AgentDB/Pinecone/Weaviate. These remain valid future adapters.
No application code should depend on pgvector SQL directly outside infrastructure repository.

## Search filters

Always filter by workspace.
Common filters:
- source ID(s),
- page/section,
- chunk type,
- language,
- date range where metadata exists.

## Retrieval scoring

P0 score can combine:
- vector similarity,
- claim importance,
- source order diversity.

Avoid returning 10 adjacent near-duplicate chunks when better coverage exists.

## Retention

Default academic MVP:
- sources retained until user deletion,
- soft delete first,
- hard delete cleanup job removes original objects, derived files, embeddings, and cached source content,
- audit events retain tombstoned resource IDs as policy allows.

Production deployment must finalize retention duration in [29_RISKS_ADRS_OPEN_DECISIONS.md](./29_RISKS_ADRS_OPEN_DECISIONS.md).

## Backup

Production path:
- PostgreSQL automated snapshots,
- object-store versioning or lifecycle policy,
- restore procedure tested before claiming production readiness.
