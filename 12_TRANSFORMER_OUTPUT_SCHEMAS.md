# Transformer Output Schemas

[Index](./00_INDEX.md) · [Previous](./11_TRANSFORMATION_ORCHESTRATOR.md) · [Next](./13_PROMPT_MANAGEMENT.md)

---


All AI results are validated as structured data before rendering.

## Executive Summary — P0

```json
{
  "title": "string",
  "executive_overview": "string",
  "key_findings": [
    {"text":"string","evidence_ids":["ev_1"]}
  ],
  "implications": ["string"],
  "recommended_actions": ["string"],
  "risks_or_uncertainties": ["string"],
  "source_note": "string|null"
}
```

Rules:
- key findings must be source-grounded,
- no invented recommendation unless explicitly framed as recommendation,
- length obeys selected detail level.

## LinkedIn Post — P0

```json
{
  "hook": "string",
  "body_blocks": [
    {"text":"string","evidence_ids":["ev_1"]}
  ],
  "call_to_action": "string|null",
  "hashtags": ["#tag"],
  "character_count": 0
}
```

Rules:
- professional platform fit,
- hashtag count configurable, default 3–5,
- `character_count` recalculated server-side; model value is not trusted.

## Twitter/X — P0

```json
{
  "mode": "single|thread",
  "posts": [
    {"position":1,"text":"string","evidence_ids":["ev_1"]}
  ]
}
```

Rules:
- server computes each post character count,
- thread numbering optional via renderer,
- hard limit defined in platform configuration, not prompt text.

## Advisory — P1

```json
{
  "title": "string",
  "risk_level": "low|medium|high|critical|not_applicable",
  "summary": "string",
  "affected_scope": ["string"],
  "impact": ["string"],
  "recommendations": ["string"],
  "indicators_or_evidence": [
    {"text":"string","evidence_ids":["ev_1"]}
  ],
  "disclaimer": "string|null"
}
```

## Infographic Specification — P1

```json
{
  "title": "string",
  "subtitle": "string|null",
  "key_message": "string",
  "sections": [
    {
      "heading":"string",
      "content":["string"],
      "visual_type":"number|timeline|bar|pie|icon_grid|process|map|text",
      "visual_data":{},
      "evidence_ids":["ev_1"]
    }
  ],
  "footer_note": "string|null"
}
```

## Presentation — P1

```json
{
  "deck_title": "string",
  "audience": "string",
  "slides": [
    {
      "slide_no":1,
      "title":"string",
      "bullets":["string"],
      "speaker_notes":"string",
      "visual_suggestion":"string|null",
      "evidence_ids":["ev_1"]
    }
  ]
}
```

## Video Package — P1

```json
{
  "title":"string",
  "target_duration_sec":60,
  "scenes":[
    {
      "scene_no":1,
      "duration_sec":6,
      "visual_description":"string",
      "narration":"string",
      "on_screen_text":"string|null",
      "subtitle":"string",
      "evidence_ids":["ev_1"]
    }
  ],
  "music_mood":"string|null",
  "asset_suggestions":["string"]
}
```

## Common metadata generated server-side

Not trusted from model:
- output/version ID,
- character/word counts,
- timestamps,
- model metadata,
- quality scores,
- approval status,
- download URLs.

## Schema evolution

Every schema has an internal `schema_version` stored with output versions.
Breaking schema changes require a new version and migration/renderer compatibility path.
