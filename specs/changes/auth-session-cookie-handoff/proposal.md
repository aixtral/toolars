# Proposal: auth-session-cookie-handoff

## Business Context

The final production security audit identified one remaining High blocker for
the Toolars AI SaaS launch: Supabase Auth/session cookies are not wired into the
server-side app and API auth path. Public calculators can remain free and
crawlable, but paid AI tools need a production-grade account boundary before
real provider credentials, billing, and cross-device state are launched.

## Problem Statement

`resolveToolarsSessionFromSupabase()` already maps a verified Supabase user and
workspace membership to a `ToolarsSession`, but `getSessionFromRequest()` still
depends on preview headers. In production, preview auth is disabled, so
`/api/ai/repurpose` fails closed for every real user and `/app/**` only knows
about preview query/cookie state.

## Scope

### Includes

- Wire Supabase SSR cookie validation into server-side session resolution.
- Load `userId`, `email`, `workspaceId`, `role`, and `planId` from verified
  Supabase Auth plus workspace membership data.
- Keep preview auth available for local/staging only and disabled in production.
- Update `/app/**` proxy guard to allow authenticated Supabase-cookie requests.
- Update `/api/ai/repurpose` to use the production session resolver while
  preserving testability through dependency injection.
- Add unit/integration coverage for anonymous, preview, production-cookie, and
  invalid-membership cases.

### Excludes

- Building hosted login/register callback flows.
- Checkout and customer portal handoff.
- Durable AI job/output history.
- Replacing short-window AI rate limiting.
- Migrating public calculator pages or calculator storage.

## Business Value

| Metric | Current | Target |
|---|---|---|
| Production AI SaaS auth | Blocks all real users or depends on preview-only paths | Real Supabase cookie session gates `/app/**` and AI API |
| Account spoofing risk | Preview headers are local-only but still the only API session shape | Production derives account state from verified Supabase Auth |
| Release readiness | Final audit High H1 open | H1 closed or downgraded with evidence |

## Stakeholders

- Users: can access subscribed AI tools through real account sessions.
- Product: can continue toward AI SaaS production release without preview auth.
- Engineering: gets a testable auth adapter boundary instead of ad hoc request
  header checks.
- Security: gets fail-closed production behavior and verifiable session-source
  separation.
