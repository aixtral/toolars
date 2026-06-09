# Proposal: usage-metering-and-plan-gates

## Business Context

Toolars has plan definitions, AI route plan checks, billing subscription storage,
and an in-memory preview usage counter. The next W2 step is to make AI usage
metering workspace-scoped and production-capable so Pro/Team limits can be
enforced consistently.

## Problem Statement

AI generation usage is currently counted in process memory by user id. This is
not durable, not workspace-scoped, and cannot support real subscription limits,
support reconciliation, or cross-device usage state.

## Scope

### Included

- Add `usage_counters` migration for monthly workspace usage.
- Add a server-only Supabase usage repository adapter.
- Add an in-memory usage repository for preview and deterministic tests.
- Route `/api/ai/repurpose` plan checks through workspace-scoped usage meters.
- Increment usage only after successful generation.
- Keep free calculators independent from billing/usage state.

### Not Included

- Usage-based Lemon Squeezy usage-record API calls.
- PDF/CSV/batch usage UI.
- Customer-facing usage history pages.
- Cross-device saved calculator sync.

## Business Value

| Metric | Current | Target |
|---|---|---|
| AI usage source | Process-memory preview counter | Workspace monthly usage counter |
| Plan gate scope | User id | Workspace id |
| Successful generation accounting | Preview-only | Shared meter repository |

## Stakeholders

- Users: Pro/Team usage limits are predictable across devices.
- Product: paid AI gating has a durable backend seam.
- Engineering: later exports and batch tools can reuse the same usage meter.
