# Proposal: auth-db-production-implementation

## Business Context

Toolars has public calculators, AI SaaS preview pages, route-level auth guards,
AI request limits, billing webhook intake, and security event logging. The next
W2 backend step is to replace preview-only account seams with production-capable
Supabase Auth/Postgres foundations.

## Problem Statement

AI route handlers and app surfaces still depend on preview sessions or static
preview UI. There is no Supabase client boundary, no production session facade,
and no account/workspace database foundation. This blocks safe AI provider,
usage metering, billing subscription, and cross-device persistence work.

## Scope

### Included

- Add Supabase Auth/Postgres client and environment boundaries under `site/lib`.
- Add a server-side Toolars session resolver that maps a validated Supabase user
  to a workspace-aware `ToolarsSession`.
- Preserve local preview fixtures while keeping preview auth disabled in
  production.
- Add first-pass Supabase SQL migration for `profiles`, `workspaces`, and
  `workspace_members` with RLS policies.
- Add static tests proving public calculator modules do not import auth,
  Supabase, billing, or AI provider code.
- Keep implementation source-driven from Supabase official docs.

### Not Included

- Billing subscription durable adapter; that remains
  `billing-subscription-db-adapter`.
- AI provider calls, streaming, retries, or cost accounting.
- AI job/output persistence and usage counters beyond the session/account
  foundation.
- Pro calculator cross-device save/export persistence.
- A full local Supabase CLI integration test harness.

## Business Value

| Metric | Current | Target |
|---|---|---|
| Auth boundary | Preview-only request/search sessions | Production-capable Supabase session facade |
| Account DB | None | Profiles/workspaces/members migration with RLS |
| Public calculator risk | Guarded by convention | Tested no auth/Supabase imports |
| Backend readiness | AI/billing work blocked by preview seams | AI/provider/billing adapter passes can build on real account foundation |

## Stakeholders

- Users: AI app access can move toward real account sessions without affecting
  free calculators.
- Business: subscription and usage features gain a durable account foundation.
- Engineering: future billing/AI/persistence passes get typed, testable
  boundaries instead of ad hoc preview helpers.
