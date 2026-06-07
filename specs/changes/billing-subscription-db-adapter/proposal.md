# Proposal: billing-subscription-db-adapter

## Business Context

Toolars already verifies Lemon Squeezy webhook signatures, parses subscription
events, and applies idempotency through an in-memory repository. The next W2
backend step is to persist billing state in Supabase/Postgres so AI plan checks
can rely on durable workspace subscription data.

## Problem Statement

The current billing webhook runtime loses subscription state on process restart.
It also cannot reconcile workspace plan state across route handlers, usage
metering, or future support workflows.

## Scope

### Included

- Add Supabase/Postgres tables for `subscription_events` and `subscriptions`.
- Add a server-only Supabase billing repository adapter.
- Keep in-memory repository support for deterministic tests and preview fallback.
- Route billing webhook processing through an injectable repository factory.
- Keep public calculator paths free from billing/database dependencies.

### Not Included

- Checkout/customer portal UI.
- Lemon Squeezy outbound API calls.
- Usage counters and plan-gate mutation logic; this is handled by
  `usage-metering-and-plan-gates`.
- Executable local Postgres/RLS harness.

## Business Value

| Metric | Current | Target |
|---|---|---|
| Billing state durability | Process memory only | Supabase-backed server repository |
| Webhook replay safety | In-memory idempotency | Provider-event unique DB idempotency |
| AI plan source | Preview session plan only | Durable workspace subscription row |

## Stakeholders

- Users: paid access survives server restarts and webhook retries.
- Support: provider event history can be inspected.
- Engineering: later usage gates can depend on a typed billing state adapter.
