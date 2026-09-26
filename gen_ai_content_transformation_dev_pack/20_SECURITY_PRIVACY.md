# Security and Privacy

[Index](./00_INDEX.md) · [Previous](./19_STORAGE_VECTOR_SEARCH.md) · [Next](./21_OBSERVABILITY_COST_CONTROL.md)

---


## Threat model focus

Primary risks:
- unauthorized workspace access,
- malicious file upload,
- SSRF through URL ingestion,
- prompt injection through source content,
- model data leakage,
- webhook secret leakage,
- XSS through generated/source content,
- API abuse/cost amplification,
- insecure object URLs,
- sensitive data in logs.

## Authentication

MVP: Firebase Auth or compatible external identity provider.
Backend verifies token signature, issuer, audience, expiry, and user status.

## Authorization

- RBAC enforced server-side.
- Every resource read/write verifies workspace membership.
- Admin operations require admin role.
- Reviewer approval requires reviewer/admin role.
- Never rely on hidden frontend controls for authorization.

## File security

- MIME sniffing + extension check,
- size limits,
- decompression limits,
- optional AV scan,
- no macros/scripts executed,
- object storage private by default.

## URL ingestion security

- block private/link-local/loopback ranges,
- DNS rebinding/redirect revalidation,
- port allowlist,
- timeout/size limits,
- sanitize fetched HTML before display.

## Prompt injection

Treat all source content as untrusted.
Never place source text in system prompt.
Run injection pattern detection and output leakage checks.

## XSS/content rendering

- React escapes text by default,
- avoid `dangerouslySetInnerHTML`,
- sanitize any allowed HTML with strict allowlist,
- validate outbound URLs.

## Secrets

Local: `.env` excluded from Git.
Production: secret manager/Vault/Kubernetes secrets with least privilege.
Rotate compromised provider/webhook secrets.

## Encryption

- TLS in transit,
- managed encryption at rest for DB/object storage,
- application-level encryption for webhook URL/secret if database exposure is a concern.

## Logging privacy

Do not log:
- full source text,
- full model prompts,
- access tokens,
- API keys,
- webhook secrets,
- raw PII fields.

Use IDs/hashes and bounded redacted excerpts only when required.

## PII policy

Workspace setting controls:
- detection,
- redaction before model,
- retention of mapping.

Do not claim regulatory compliance solely because PII detection is enabled.

## Rate limits

Apply per user/workspace:
- upload rate,
- transform requests/minute,
- concurrent jobs,
- maximum source bytes,
- monthly token/cost guardrails.

## Audit

Security-relevant events:
- auth failures above threshold,
- role changes,
- webhook changes,
- prompt activation,
- quality override,
- data deletion,
- delivery attempt.

## Dependency security

CI:
- dependency vulnerability scan,
- secret scan,
- static analysis,
- container scan for production images,
- OWASP ZAP against staging for core endpoints/UI.

## Security acceptance

No P0 release if:
- cross-workspace access test fails,
- secrets appear in logs,
- URL ingestion can reach private metadata addresses,
- output/source HTML can execute script,
- prompt injection test can reveal system/developer prompt content.
