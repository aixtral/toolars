# Proposal: billing-webhook-production-pass

## Business Context

Toolars needs paid AI access, Pro exports, batch tools, and cross-device saves to
depend on server-owned billing state. The current billing webhook is a preview
exercise and cannot safely grant or revoke access.

## Problem Statement

`POST /api/billing/webhook` still uses custom preview headers and a simplified
payload. It does not parse Lemon Squeezy webhook headers, verify `X-Signature`,
track provider event idempotency, or mutate any subscription state.

## Scope

### Included

- Add Lemon Squeezy raw-body HMAC verification using `X-Signature`.
- Parse subscription events from the documented JSON:API webhook shape and
  `X-Event-Name`.
- Add provider event idempotency and subscription state mutation through a
  server-only repository contract.
- Add an in-memory repository implementation for current preview runtime tests.
- Add status-to-access mapping for paid, grace, paused, paid-until-end, and free
  states.
- Update route tests and billing library tests.

### Excluded

- Supabase/Postgres schema, RLS policies, and durable adapter implementation.
- Checkout creation and customer portal UI.
- Real production subscription lookup in AI plan gates.
- Lemon Squeezy API client calls.

## Business Value

| Metric | Current | Target |
|---|---|---|
| Webhook signature model | Preview custom headers | Lemon Squeezy `X-Signature` |
| Duplicate event handling | None | Duplicate event returns success without mutation |
| Subscription state mutation | None | Server-only repository mutation path |
| Production release risk | H3 blocker | H3 reduced to DB-adapter follow-up |

## Stakeholders

- Users: paid access should reflect provider subscription status.
- Engineering: billing state becomes a testable server boundary.
- Security/release: provider replay and plan escalation risks are reduced.
