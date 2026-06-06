# Proposal: security-event-logging-pass

## Business Context

Toolars now has protected app routes, AI runtime limits, and Lemon Squeezy-shaped
billing webhook intake. The next release-gate gap is observability for security
failures in AI and billing API routes.

## Problem Statement

AI auth failures, plan denials, invalid payloads, billing signature failures,
missing webhook secrets, unsupported billing events, and unknown billing
variants are returned to the client but not recorded server-side. Abuse, replay
attempts, webhook drift, and provider integration errors would be hard to
investigate.

## Scope

### Included

- Add a server-side security event recorder with request IDs and safe metadata.
- Record AI route failures for missing session, body limit, JSON parse failure,
  validation failure, preview rate limit, and plan denial.
- Record billing webhook failures for missing secret, invalid signature,
  unsupported provider payload, and failed event processing.
- Add tests proving events are emitted and do not include AI source text,
  webhook raw body, signatures, secrets, or customer email.

### Excluded

- External log provider integration.
- Persistent audit table.
- User-facing UI for event inspection.
- Full application analytics for search/calculator interactions.

## Business Value

| Metric | Current | Target |
|---|---|---|
| M3 audit status | No security event logging | AI/billing failures emit safe structured events |
| Incident triage | Client response only | Request ID, route, reason, status, safe IDs |
| Sensitive logging risk | Undefined | Tests prevent raw payload/source/signature leaks |

## Stakeholders

- Security/release: M3 is reduced before production readiness review.
- Engineering: failure paths become inspectable without leaking secrets.
- Support: billing and AI incidents have request IDs and route-level context.
