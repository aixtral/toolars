# Proposal: auth-db-production-design

## Business Context

Toolars currently has a runnable public site and preview AI SaaS surfaces, but
production account, persistence, and subscription state are still intentionally
mocked. The next W2 step is to turn the Supabase Auth/Postgres decision into a
reviewable implementation design before adding dependencies or migrations.

## Problem Statement

Preview auth uses query parameters and headers, AI history is local/static, and
billing state is not persisted. Without a concrete auth/database design, future
implementation work can accidentally make public calculators depend on session
state, expose user-owned AI data, or mix billing webhooks with client-side
account code.

## Scope

### Included

- Define the production Auth and Postgres architecture for Toolars.
- Define the first-pass database entities for profiles, workspaces,
  subscriptions, usage, AI jobs, outputs, brand voices, saved calculator
  results, exports, and audit events.
- Define RLS ownership boundaries and service-role-only operations.
- Define the migration path from preview sessions to real Supabase sessions.
- Record official Supabase source URLs for SSR auth, user profile data, table
  design, and Row Level Security decisions.

### Excluded

- No Supabase package installation.
- No SQL migrations or generated database types.
- No production auth route implementation.
- No billing webhook state mutation implementation.
- No AI provider adapter implementation.

## Business Value

| Metric | Current | Target |
|---|---|---|
| Auth state | Preview query/header sessions | Source-backed Supabase SSR design |
| Persistence model | Local/static preview data | Reviewed Postgres schema plan |
| Data security | Helper-level tests only | RLS and service-role boundaries designed before code |
| Implementation readiness | W2 backend work too broad | Sequenced implementation plan with verification gates |

## Affected Stakeholders

- Users: account data, AI history, brand voices, and Pro saved results must be
  protected and portable across devices.
- Engineering: future implementation passes get a stable schema and module
  boundary instead of improvising around preview helpers.
- Security/review: RLS, service keys, webhook writes, and route protection are
  explicit before production code lands.
