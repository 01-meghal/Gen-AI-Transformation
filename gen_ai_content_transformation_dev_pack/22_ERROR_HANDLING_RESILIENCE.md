# Error Handling and Resilience

[Index](./00_INDEX.md) · [Previous](./21_OBSERVABILITY_COST_CONTROL.md) · [Next](./23_TESTING_EVALUATION.md)

---


## Error taxonomy

### Client errors
- `VALIDATION_ERROR`
- `PERMISSION_DENIED`
- `NOT_FOUND`
- `VERSION_CONFLICT`
- `SOURCE_NOT_READY`
- `UNSUPPORTED_MEDIA_TYPE`
- `FILE_TOO_LARGE`

### Ingestion errors
- `DOCUMENT_ENCRYPTED`
- `PARSER_FAILED`
- `NO_EXTRACTABLE_CONTENT`
- `URL_BLOCKED`
- `URL_FETCH_FAILED`
- `SECURITY_SCAN_FAILED`

### AI errors
- `PROVIDER_UNAVAILABLE`
- `RATE_LIMITED`
- `MODEL_AUTH_ERROR`
- `CONTEXT_TOO_LARGE`
- `STRUCTURED_OUTPUT_INVALID`
- `SAFETY_BLOCK`

### Quality errors
- `GROUNDING_FAILED`
- `FORMAT_LIMIT_EXCEEDED`
- `PII_POLICY_VIOLATION`
- `PROMPT_INJECTION_RISK`

### Delivery errors
- `WEBHOOK_CONFIG_INVALID`
- `WEBHOOK_REJECTED`
- `WEBHOOK_TIMEOUT`

## User-facing errors

Must be:
- actionable,
- safe,
- free of stack traces/provider secrets,
- associated with request/job ID.

## Retry classification

Retryable:
- timeouts,
- provider 429/5xx,
- temporary object storage failure,
- message broker transient failure,
- webhook 408/429/5xx.

Not retryable without changed input:
- unsupported format,
- invalid auth,
- blocked URL,
- encrypted document without password support,
- schema contract bug after repair attempt.

## Circuit breakers

Add provider-level circuit breaker after repeated failures to prevent queue amplification.
Fallback provider can be used if policy allows.

## Timeouts

Set explicit connect/read/overall timeouts for:
- URL fetch,
- provider calls,
- webhook calls,
- object store calls.

No unbounded network wait.

## Idempotent recovery

After process crash, worker rechecks database stage result before redoing side effects.
Output version creation and delivery attempt creation must be idempotent per job/stage key.

## Database failures

- rollback transaction,
- do not acknowledge queue message until safe persistence,
- use bounded retries for connection/transient serialization errors,
- avoid retrying integrity violations blindly.

## Degraded mode

If optional analyzer fails:
- mark warning,
- continue if critical analysis exists.

If primary LLM fails and fallback disabled:
- fail transform job cleanly; source remains reusable.

## Support diagnostics

Internal error record may include:
- exception class,
- sanitized message,
- provider request ID,
- task stage,
- model alias,
- retry count.

Raw source/prompt should not be attached automatically.
