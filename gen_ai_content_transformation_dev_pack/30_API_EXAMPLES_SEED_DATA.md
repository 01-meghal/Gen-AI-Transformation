# API Examples and Seed Data

[Index](./00_INDEX.md) · [Previous](./29_RISKS_ADRS_OPEN_DECISIONS.md) · [Next](./31_TRACEABILITY_VALIDATION.md)

---


## Example 1 — create text source

```http
POST /api/v1/projects/8ce.../sources:text
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Quarterly Operations Update",
  "text": "Revenue increased ...",
  "metadata": {"source_kind": "internal_report"}
}
```

Response:
```json
{
  "source": {
    "id": "b3a...",
    "status": "PROCESSING",
    "title": "Quarterly Operations Update"
  },
  "job": {
    "id": "6f1...",
    "type": "INGEST_SOURCE",
    "status": "QUEUED"
  }
}
```

## Example 2 — request multiple transformations

```http
POST /api/v1/sources/b3a.../transformations
Idempotency-Key: demo-001
Content-Type: application/json

{
  "targets": ["executive_summary", "linkedin_post", "x_post"],
  "configuration": {
    "audience": "executives",
    "tone": "formal",
    "language": "en",
    "detail_level": "high_level",
    "objective": "inform",
    "content_style": "bullet_points",
    "length_target": "medium",
    "fact_strictness": "high"
  }
}
```

Response:
```json
{
  "batch_id": "c10...",
  "jobs": [
    {"id":"j1","target":"executive_summary","status":"QUEUED"},
    {"id":"j2","target":"linkedin_post","status":"QUEUED"},
    {"id":"j3","target":"x_post","status":"QUEUED"}
  ]
}
```

## Example 3 — output version

```json
{
  "output_id": "o1",
  "version": {
    "id": "ov3",
    "version": 3,
    "origin": "ai",
    "status": "READY_FOR_REVIEW",
    "schema_version": "1.0",
    "content": {
      "title": "Quarterly Operations Update",
      "executive_overview": "...",
      "key_findings": [
        {"text":"Revenue increased 12%.","evidence_ids":["ev_4"]}
      ],
      "implications": ["..."],
      "recommended_actions": ["..."],
      "risks_or_uncertainties": []
    },
    "quality_report": {
      "overall":"pass",
      "score":0.93,
      "blocking_reasons":[],
      "warnings":[]
    }
  }
}
```

## Example 4 — section regeneration

```json
{
  "base_version_id": "ov3",
  "section_path": "/recommended_actions",
  "instruction": "Make actions more concise and suitable for executives. Do not add new facts."
}
```

## Example 5 — review

```json
{
  "decision": "approved",
  "comment": "Source evidence verified."
}
```

## Seed users

```text
admin@example.local      role=admin
editor@example.local     role=editor
reviewer@example.local   role=reviewer
viewer@example.local     role=viewer
```

Use fake-auth IDs only in local/test.

## Seed brand profile

```json
{
  "name": "Default Professional",
  "voice_rules": {
    "traits": ["clear", "professional", "concise"],
    "avoid": ["unverified superlatives", "clickbait"]
  },
  "forbidden_terms": [],
  "preferred_terms": {}
}
```

## Seed source fixtures

Minimum:
1. short news article,
2. quarterly report excerpt,
3. policy memo,
4. research abstract,
5. incident report,
6. adversarial prompt-injection document.

Each fixture has expected important claims/evidence for evaluation.

## Webhook signature example

Canonical signed bytes are exact request body bytes.

```text
signature = hex(HMAC_SHA256(secret, timestamp + "." + body_bytes))
```

Receiver rejects stale timestamps and duplicate event IDs.
