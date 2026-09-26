# Domain Model and Database Schema

[Index](./00_INDEX.md) · [Previous](./05_REPOSITORY_AND_SERVICE_BOUNDARIES.md) · [Next](./07_API_CONTRACTS.md)

---


## Core entities

### Workspace
- `id UUID PK`
- `name varchar(160)`
- `slug varchar(120) unique`
- `settings jsonb`
- timestamps

### User
- `id UUID PK`
- `external_auth_id varchar unique`
- `email citext unique`
- `display_name`
- `status`
- timestamps

### WorkspaceMember
- `workspace_id FK`
- `user_id FK`
- `role enum(admin,editor,reviewer,viewer)`
- unique `(workspace_id,user_id)`

### Project
- `id UUID PK`
- `workspace_id FK`
- `name`
- `description`
- `created_by`
- `archived_at nullable`

### Source
- `id UUID PK`
- `workspace_id FK`
- `project_id FK`
- `source_type enum(text,file,url)`
- `original_name/url`
- `media_type`
- `language`
- `status`
- `object_key nullable`
- `sha256 nullable`
- `size_bytes`
- `page_count nullable`
- `metadata jsonb`
- `created_by`
- timestamps

### SourceBlock
Canonical logical units.
- `id UUID PK`
- `source_id FK`
- `ordinal int`
- `block_type`
- `text`
- `page_no nullable`
- `start_offset nullable`
- `end_offset nullable`
- `metadata jsonb`

### SourceChunk
Model retrieval units.
- `id UUID PK`
- `source_id FK`
- `ordinal`
- `text`
- `token_count`
- `embedding vector(...) nullable`
- `block_refs uuid[]/jsonb`
- `metadata jsonb`

### Claim
- `id UUID PK`
- `source_id FK`
- `claim_text`
- `claim_type`
- `importance smallint`
- `confidence numeric`
- `evidence jsonb` containing block/chunk refs and quoted offsets

### BrandProfile
- `id UUID PK`
- `workspace_id FK`
- `name`
- `voice_rules jsonb`
- `visual_tokens jsonb`
- `forbidden_terms text[]`
- `preferred_terms jsonb`
- `active_version int`

### PromptTemplate
- `id UUID PK`
- `workspace_id nullable` for system/global templates
- `transform_type`
- `name`
- `status`
- timestamps

### PromptVersion
- `id UUID PK`
- `prompt_template_id FK`
- `version int`
- `system_text`
- `developer_text`
- `input_schema jsonb`
- `output_schema jsonb`
- `model_defaults jsonb`
- `created_by`
- unique `(prompt_template_id,version)`

### TransformationBatch
Groups multiple target formats.
- `id UUID PK`
- `source_id FK`
- `workspace_id FK`
- `requested_by`
- `configuration jsonb`
- timestamps

### Job
- `id UUID PK`
- `workspace_id FK`
- `batch_id nullable`
- `source_id nullable`
- `job_type`
- `status`
- `progress int`
- `attempt_count`
- `idempotency_key nullable`
- `error_code nullable`
- `error_safe_message nullable`
- `started_at/completed_at`
- `metadata jsonb`

### Output
Logical artifact.
- `id UUID PK`
- `workspace_id FK`
- `project_id FK`
- `source_id FK`
- `transform_type`
- `status`
- `current_version_id nullable`
- timestamps

### OutputVersion
Immutable snapshot.
- `id UUID PK`
- `output_id FK`
- `version int`
- `origin enum(ai,user_edit,regeneration)`
- `content jsonb`
- `rendered_text text`
- `configuration jsonb`
- `prompt_version_id FK nullable`
- `model_metadata jsonb`
- `quality_report jsonb`
- `created_by nullable`
- timestamps
- unique `(output_id,version)`

### Review
- `id UUID PK`
- `output_version_id FK`
- `reviewer_id FK`
- `decision enum(approved,changes_requested,rejected)`
- `comment text nullable`
- timestamp

### Comment
- `id UUID PK`
- `output_id FK`
- `output_version_id nullable`
- `author_id`
- `parent_id nullable`
- `anchor jsonb nullable`
- `body`
- `resolved_at nullable`

### WebhookEndpoint
- `id UUID PK`
- `workspace_id FK`
- `name`
- `url_encrypted`
- `secret_encrypted`
- `enabled`
- `event_types text[]`

### DeliveryAttempt
- `id UUID PK`
- `webhook_endpoint_id FK`
- `output_version_id FK`
- `status`
- `http_status nullable`
- `attempt_no`
- `next_retry_at nullable`
- `response_excerpt nullable`

### AuditEvent
- `id bigserial PK`
- `workspace_id`
- `actor_user_id nullable`
- `event_type`
- `resource_type/resource_id`
- `request_id`
- `details jsonb`
- `created_at`

### UsageRecord
- `id bigserial PK`
- `workspace_id`
- `job_id`
- `provider`
- `model`
- `input_tokens/output_tokens`
- `estimated_cost_usd`
- `latency_ms`
- `created_at`

## Required indexes

- `source(workspace_id, project_id, created_at desc)`
- `source(status)`
- `source_chunk(source_id, ordinal)`
- vector HNSW/IVFFlat index per pgvector decision
- `job(workspace_id, status, created_at desc)`
- unique partial index on `job(idempotency_key)` where not null scoped by workspace
- `output(workspace_id, project_id, updated_at desc)`
- `output_version(output_id, version desc)`
- `audit_event(workspace_id, created_at desc)`
- `usage_record(workspace_id, created_at desc)`

## Data integrity rules

- Every output source belongs to same workspace as output.
- Approved output version cannot be updated.
- `current_version_id` must point to same output.
- deleting a workspace is a controlled admin process, not an ordinary cascade.

## Migration rule

Use Alembic; every schema change ships with forward migration and, when safe, downgrade.
