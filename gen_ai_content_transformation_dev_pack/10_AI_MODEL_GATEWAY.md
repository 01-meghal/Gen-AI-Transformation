# AI Model Gateway

[Index](./00_INDEX.md) · [Previous](./09_ANALYSIS_UNDERSTANDING.md) · [Next](./11_TRANSFORMATION_ORCHESTRATOR.md)

---


## Goal

All LLM/embedding/speech provider calls go through stable interfaces so provider/model changes do not affect business logic.

## Interfaces

### `LLMProvider.generate_structured()`
Inputs:
- `system_text`,
- `developer_text`,
- `input_payload`,
- JSON schema,
- model alias,
- temperature,
- max output tokens,
- timeout,
- trace metadata.

Returns:
- parsed structured result,
- raw provider request ID,
- model name/version,
- input/output token counts,
- latency,
- finish reason,
- safety/provider flags.

### `EmbeddingProvider.embed()`
Batch text to vectors with model metadata.

### `SpeechProvider.transcribe()`
P1 transcription contract with timestamps.

## Provider routing

Model aliases isolate business code from concrete names:
- `reasoning_high`,
- `generation_standard`,
- `generation_fast`,
- `embedding_default`,
- `speech_default`.

Configuration maps aliases to provider/model.

## Default routing strategy

- Primary generation: Claude-family provider per proposal.
- Secondary/fallback: OpenAI-family provider.
- Embeddings: SBERT-compatible local or service adapter.
- Speech: Whisper-compatible adapter.

No transformer may hard-code a provider model string.

## Structured output policy

Preferred order:
1. provider-native JSON/schema mode,
2. tool/function schema mode,
3. constrained JSON prompt + strict parser fallback.

Never persist an AI candidate as a valid output version until schema validation succeeds.

## Retry policy

Retry only transient failures:
- 408/429,
- 5xx,
- network timeout,
- provider temporary overload,
- recoverable schema parse failure with repair prompt.

Do not retry:
- auth error,
- invalid request,
- content policy block without changed input,
- context too large without context reduction.

Default backoff: exponential + jitter, max 3 provider attempts per job stage.

## Context overflow handling

1. estimate tokens before call,
2. reduce low-priority chunks,
3. switch to hierarchical context if needed,
4. if still too large, fail with `CONTEXT_TOO_LARGE`.

## Rate limiting

Track per provider/model:
- request rate,
- token rate,
- concurrent in-flight calls.

Workers must honor central limits to avoid thundering herd.

## Cost accounting

Each call emits usage data to `UsageRecord`.
Cost estimation is configuration-based and versioned because prices change.

## Determinism

For core transformations:
- use low-to-medium temperature,
- use stable prompt versions,
- store exact model alias and resolved model,
- set seed only when provider supports it; do not rely on exact reproducibility.

## Safety separation

Source content must be wrapped as untrusted data.
System/developer messages explicitly instruct model not to follow instructions embedded in the source.

## Provider fallback rule

Fallback may occur when:
- primary unavailable,
- rate limit prevents timely completion,
- configured model does not support requested capability.

Output version records the actual provider/model used.

## Evaluation rule

Changing the default model mapping requires passing the prompt/model regression suite defined in [23_TESTING_EVALUATION.md](./23_TESTING_EVALUATION.md).
