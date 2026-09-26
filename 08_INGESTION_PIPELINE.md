# Input Ingestion Pipeline

[Index](./00_INDEX.md) · [Previous](./07_API_CONTRACTS.md) · [Next](./09_ANALYSIS_UNDERSTANDING.md)

---


## Objective

Convert heterogeneous user content into a canonical, secure, traceable source representation.

## P0 adapters

### Direct text / TXT / Markdown
- UTF-8 normalize.
- preserve headings where detectable.
- collapse unsafe control characters.
- retain source line offsets when practical.

### PDF
- extract text per page,
- preserve page number,
- detect empty/scanned pages,
- optional OCR fallback only when configured,
- store original file in object storage.

### DOCX
- extract paragraphs and headings,
- extract table text with row/column metadata,
- ignore macros/embedded executables,
- preserve paragraph order.

### URL
- allow only `http/https`,
- block localhost/private/link-local IP ranges,
- bounded redirects,
- bounded response size,
- content-type allowlist,
- extract primary article/body content,
- store retrieval metadata and canonical URL.

## P1 adapters

- PPTX: slide text, notes, tables, image references.
- JPG/PNG: OCR + caption + dimensions.
- MP4/MOV: audio transcription + scene timestamps.

## Processing stages

1. **Receive** metadata/upload reference.
2. **Security validate** type, size, extension vs MIME, URL policy.
3. **Hash** file/content for deduplication.
4. **Parse** with adapter.
5. **Normalize** whitespace, Unicode, headings, list structure.
6. **Language detect** at document and optionally block level.
7. **PII scan** if workspace policy enabled.
8. **Deduplicate** repeated headers/footers and repeated blocks.
9. **Chunk** into model/retrieval units.
10. **Persist** blocks/chunks.
11. **Analyze** via [09_ANALYSIS_UNDERSTANDING.md](./09_ANALYSIS_UNDERSTANDING.md).
12. **Mark ready** and emit event.

## Canonical block model

Each block contains:
- `ordinal`,
- `type`: heading, paragraph, list_item, table, quote, caption, transcript_segment,
- `text`,
- `page_no/time_range`,
- original offsets where available,
- parser metadata.

## Chunking strategy

Default target:
- 500–900 tokens per chunk,
- 10–15% overlap for narrative text,
- never split heading from the following short paragraph,
- avoid splitting tables mid-row,
- preserve page/time references.

For very large sources:
- create chunk summaries,
- create section summaries,
- then use hierarchical transformation context.

## Duplicate removal

Use two levels:
- exact normalized hash,
- near-duplicate similarity above configured threshold.

Do not remove similar content if it has different page/time provenance unless clearly boilerplate.

## File safety checks

- maximum size configurable by type,
- ZIP-bomb and decompression limits for office formats,
- optional ClamAV scan hook,
- reject executables,
- sanitize filenames,
- never execute document macros/scripts.

## URL safety

Protect against SSRF:
- DNS resolve and validate destination before connect,
- revalidate on redirect,
- deny private CIDRs and metadata endpoints,
- set connect/read timeouts,
- restrict ports to 80/443 by default.

## PII handling

Modes:
- `off`,
- `detect_only`,
- `redact_before_model`.

If redacted, maintain a reversible mapping only when policy allows; otherwise use irreversible placeholders.

## Ingestion output contract

Source can transition to `READY` only when:
- at least one usable block exists,
- chunk generation succeeded,
- mandatory security checks passed,
- metadata row is committed,
- downstream analysis baseline is complete or explicitly marked partial.

## Parser errors

User-facing examples:
- `UNSUPPORTED_MEDIA_TYPE`,
- `FILE_TOO_LARGE`,
- `DOCUMENT_ENCRYPTED`,
- `PARSER_FAILED`,
- `URL_BLOCKED`,
- `URL_FETCH_FAILED`,
- `NO_EXTRACTABLE_CONTENT`.

Technical stack traces never return to client.
