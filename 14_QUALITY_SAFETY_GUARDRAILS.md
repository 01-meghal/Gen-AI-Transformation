# Quality, Safety and Guardrails

[Index](./00_INDEX.md) · [Previous](./13_PROMPT_MANAGEMENT.md) · [Next](./15_OUTPUT_RENDERING_DELIVERY.md)

---


## Quality pipeline

Each candidate passes checks in this order:
1. schema validity,
2. platform/format hard limits,
3. source grounding,
4. factual consistency heuristics,
5. brand/style rules,
6. readability/clarity,
7. PII/secrets policy,
8. safety/prompt-injection indicators,
9. final aggregate decision.

## Quality report shape

```json
{
  "overall":"pass|warn|fail",
  "score":0.0,
  "checks":[
    {"name":"grounding","status":"pass","score":0.94,"details":[]}
  ],
  "blocking_reasons":[],
  "warnings":[]
}
```

## Grounding check

For each factual sentence/block:
- map to declared `evidence_ids`,
- retrieve corresponding source text,
- compute lexical/semantic support,
- optionally run a low-cost entailment/LLM judge,
- flag unsupported high-impact claims.

`fact_strictness=high` blocks approval on unsupported material claims.

## Factual consistency rules

Flag:
- changed numbers,
- changed dates,
- reversed comparisons,
- invented names/entities,
- absolute language replacing qualified source language,
- unattributed claims originally attributed to a source/person.

## Platform checks

### LinkedIn
- configurable maximum character budget,
- hashtag count/style,
- no accidental thread numbering.

### X
- each post within configured character limit,
- thread ordering valid,
- URLs counted using platform config if applicable.

### Executive summary
- mandatory fields present,
- length within selected band,
- actions clearly separated from source facts.

## Brand checks

Rules can include:
- required terminology,
- forbidden terms,
- preferred capitalization,
- voice traits,
- disallowed claims,
- CTA conventions.

Visual tokens apply only to renderers, not factual content.

## PII and secrets

Detect or block according to workspace policy:
- emails/phones,
- government identifiers,
- credentials/API keys,
- private tokens,
- other configured patterns.

Never send detected secrets to external model providers when avoidable.

## Prompt injection guardrails

Signals:
- “ignore previous instructions”,
- fake system messages,
- credential requests,
- commands to exfiltrate data,
- tool invocation instructions inside source.

Response:
- source remains data,
- high-risk patterns are tagged,
- output is checked for leaked internal instructions,
- severe cases may block automatic generation.

## Toxicity/bias

Use configurable detectors mainly as warnings unless workspace policy makes them blocking.
Do not automatically rewrite source facts merely because they describe harmful content.

## Human review

Mandatory approval can be configured for:
- advisory/high-risk outputs,
- security/threat content,
- regulated domain workspaces,
- outputs with quality warning or override.

## Quality score guidance

Suggested weighted score:
- grounding 40%,
- format compliance 20%,
- factual consistency 20%,
- brand/style 10%,
- readability 10%.

Weights are configurable by transformer.

## Override

Admin/reviewer may override non-security quality failures with reason.
Override must create an audit event and never erase the original failed check.
