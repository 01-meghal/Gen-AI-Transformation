# Analysis and Understanding Layer

[Index](./00_INDEX.md) · [Previous](./08_INGESTION_PIPELINE.md) · [Next](./10_AI_MODEL_GATEWAY.md)

---


## Purpose

Create a compact, traceable semantic representation that transformations can reuse without re-analyzing the entire source for every output.

## Required P0 analysis products

### Document profile
- detected language,
- source type,
- document title/author/date when available,
- estimated token count,
- top topics,
- summary for navigation only,
- sensitivity flags.

### Entity extraction
Entity types:
- PERSON,
- ORGANIZATION,
- LOCATION,
- DATE/TIME,
- PRODUCT,
- MONEY/NUMBER,
- DOMAIN_SPECIFIC.

Store normalized entity + occurrences/evidence references.

### Claim extraction
A claim is a potentially output-worthy factual statement.

For each claim store:
- `claim_text`,
- `claim_type` such as fact, metric, recommendation, event, attribution,
- importance 1–5,
- confidence,
- evidence block/chunk IDs,
- exact excerpt offsets where practical.

Claims are the primary grounding unit for quality checks.

### Topic/key-point extraction
Return 5–20 ranked topic/key-point objects based on source size.

### Sentiment/urgency
Optional for P0 but interface included.
Do not treat sentiment as factual truth; it is metadata for tone adaptation.

## Embeddings

Generate vector embeddings for chunks.

P0 default:
- SBERT-compatible model,
- deterministic embedding model version in metadata,
- vector search scoped by `workspace_id + source_id`.

## Retrieval for transformation

Context builder takes:
- output type,
- configuration,
- source ID,
- token budget.

It returns:
- document profile,
- high-importance claims,
- selected chunks,
- brand rules,
- prior user instruction if regeneration.

Retrieval ranking combines:
- semantic similarity,
- claim importance,
- section diversity,
- recency/order where relevant.

## Source evidence map

Every transformer result should be able to reference stable evidence IDs.

Example internal structure:
```json
{
  "evidence_id": "ev_17",
  "source_chunk_id": "...",
  "page_no": 4,
  "excerpt": "...",
  "claim_ids": ["..."]
}
```

Evidence excerpts are bounded to avoid duplicating full source content in downstream logs.

## Multimodal P1

### Image
- OCR text,
- caption,
- object/scene tags,
- safety labels,
- CLIP-compatible embedding.

### Video
- speech transcription,
- timestamps,
- speaker labels where practical,
- scene boundaries,
- keyframes/captions.

### Audio
- transcription,
- speaker diarization optional,
- timestamps,
- language.

## Factuality principle

The analysis layer does not invent missing facts.
Unknown values remain absent/null.

## Caching

Cache by:
- source content hash,
- analyzer name/version,
- model version,
- configuration hash.

A model/version change invalidates only dependent analysis products.

## Failure policy

Analysis modules are classified:
- **critical**: chunking, language, minimal claim/evidence extraction,
- **optional**: sentiment, advanced topic model, multimodal enrichment.

Optional module failures create warnings and allow source readiness if core information is usable.
