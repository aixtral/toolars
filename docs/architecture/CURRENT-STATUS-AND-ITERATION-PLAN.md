# toolars Current Status And Iteration Plan

Status: W2 security-productionization branch-stack review baseline  
Updated: 2026-06-06  
Source branch: `feat/billing-webhook-production-pass`

## 1. Executive Summary

Toolars has moved from design handoff to a runnable Next.js App Router
implementation and into the first W2 security-productionization stack. The
current branch stack includes the public utility shell, 73 calculator routes,
calculator detail workspaces, AI SaaS preview pages, commercial/legal pages,
SEO/GEO discovery surfaces, URL-driven tools directory search, a security
release-gate audit, `/app/**` route guarding, AI runtime request limits, and
Lemon Squeezy-shaped billing webhook intake.

The project is not yet production SaaS complete. The public site and preview
application are strong enough for integration review, and several high-risk
security seams have been reduced, but real Supabase/Auth session persistence,
durable database adapters, AI provider integration, production usage metering,
application observability, dependency remediation, and release-readiness audits
remain release-blocking work.

## 2. Current Implementation Snapshot

| Area | Current status |
|---|---|
| Framework | Next.js App Router 16.2.6 in `site/` |
| Language | TypeScript |
| Styling | Tailwind CSS 4, local design primitives, Lucide icons |
| Routes | 104 routes/pages reported by `next build` on the latest stack |
| Calculators | 73 calculator definitions and route slugs |
| Calculator UX | Shared detail workspace with calculate, reset, local save, compare, share |
| Tools directory | `/tools` default directory plus `/tools?search=<query>` server-rendered search |
| AI SaaS | Preview app shell and pages for repurpose, templates, brand voice, history, analytics, settings |
| Auth | `/app/**` is guarded by Next proxy; preview sessions still exist; no production provider/session cookies yet |
| AI runtime | Preview AI route now has body/source limits, platform normalization, and in-memory preview rate/usage guard |
| Billing | Lemon Squeezy-shaped webhook signature/parser/idempotency repository contract exists; no durable Supabase/Postgres adapter yet |
| SEO/GEO | sitemap, robots, llms.txt, root Open Graph/Twitter, Organization/WebSite/SearchAction JSON-LD |
| Tests | Vitest/Testing Library and Playwright |

Latest verification evidence on the current stack:

```text
pnpm --dir site lint        -> pass
pnpm --dir site type-check  -> pass
pnpm --dir site test        -> 26 files / 94 tests passed
pnpm --dir site test:e2e -- auth-billing -> 3 tests passed
pnpm --dir site build       -> 104 pages/routes reported
cdc-workflow gate           -> pass
cdc-workflow ship-preview   -> pass
```

## 3. Branch Stack

Current `main` is behind the latest integration branch. The latest working
stack is:

| Branch | Purpose |
|---|---|
| `feat/design-conformance-pass` | Current `main`; design shell and first conformance pass |
| `feat/toolars-v1-design-integration` | Integrated v1 design stack and calculator detail pass |
| `feat/release-shell-polish-pass` | Footer, custom 404, 404 metadata |
| `feat/legal-terms-discovery-pass` | Terms page and discovery coverage |
| `feat/site-graph-metadata-pass` | Root metadata, Open Graph, Twitter card, Organization/WebSite JSON-LD |
| `feat/tools-query-search-pass` | `/tools?search=` server-rendered query results |
| `feat/context-refresh-and-integration-pass` | Context refresh and iteration plan |
| `feat/security-audit-release-gate` | Release-gate security audit and production blockers |
| `feat/auth-route-guard-implementation` | Next proxy guard for `/app/**` and preview auth routing tests |
| `feat/ai-runtime-security-pass` | AI route request/body/source limits, normalization, and in-memory preview rate/usage guard |
| `feat/billing-webhook-production-pass` | Lemon Squeezy `X-Signature` intake, event parser, idempotency, and subscription repository contract |

Recommended merge strategy:

1. Keep PR #1 from `feat/context-refresh-and-integration-pass` to `main` as the
   W0 integration anchor until the stacked security PRs are reviewed.
2. Review the stacked security PRs in order: #6 security audit, #7 auth route
   guard, #8 AI runtime security, #9 billing webhook production intake.
3. Re-run the full verification gate on the top stack branch before marking any
   draft PR ready.
4. Merge only after confirming no hidden branch-stack drift and after deciding
   whether W1/W2 parallel design branches should be rebased into the same stack
   or reviewed independently.

Open draft PR state as of 2026-06-06:

| PR | Head | Base | Status |
|---|---|---|---|
| #1 | `feat/context-refresh-and-integration-pass` | `main` | open draft, mergeable |
| #2 | `feat/calculator-golden-fixtures-pass` | `feat/context-refresh-and-integration-pass` | open draft, mergeable |
| #3 | `feat/auth-db-production-design` | `feat/context-refresh-and-integration-pass` | open draft, mergeable |
| #4 | `feat/ai-provider-adapter-pass` | `feat/context-refresh-and-integration-pass` | open draft, mergeable |
| #5 | `feat/billing-subscription-state-pass` | `feat/context-refresh-and-integration-pass` | open draft, mergeable; design content has also been pulled into #9 |
| #6 | `feat/security-audit-release-gate` | `feat/context-refresh-and-integration-pass` | open draft, mergeable |
| #7 | `feat/auth-route-guard-implementation` | `feat/security-audit-release-gate` | open draft, mergeable |
| #8 | `feat/ai-runtime-security-pass` | `feat/auth-route-guard-implementation` | open draft, mergeable |
| #9 | `feat/billing-webhook-production-pass` | `feat/ai-runtime-security-pass` | open draft, mergeable |

## 4. Preview Boundaries

These systems are intentionally preview or MVP-level and must not be described
as production-complete:

| System | Current boundary | Required production work |
|---|---|---|
| Auth | `/app/**` proxy guard exists; query/header preview sessions still exist and H4 env risk remains | Real provider, session cookies, production env gate, user profile storage |
| AI generation | Deterministic local draft generation with request/source limits and in-memory preview rate/usage guard | Provider adapters, streaming route behavior, retries, durable usage metering, cost tracking, logging |
| Billing | Lemon Squeezy-shaped intake, event parser, idempotency, and subscription repository contract | Supabase/Postgres `subscriptions` and `subscription_events` adapter, user-plan reconciliation |
| Persistence | Local storage for anonymous calculator saves/comparisons | Account-backed saved results, cross-device sync, Pro export history |
| Observability | CDC evidence and automated tests | Application analytics/events, error reporting, trace IDs for AI and billing |
| Security | Release audit exists; H1 route guard, local H2 request limits, and H3 webhook intake have follow-up PRs | H4 production env gate, M2 dependency remediation, M3 event logging, and a final production security audit |
| Calculator formulas | All routes have formula engines; high-risk formulas have representative tests | Golden value suites and source review for high-risk finance/health calculators |

## 5. Iteration Plan

### W0: Integration And Context Reset

Goal: make the latest stack the reviewable source of truth.

Status: substantially complete but not merged to `main`.

Deliverables:

- Refresh `.cdc/CONTEXT.md` and `.cdc/ARCHITECTURE.md`.
- Add this status and iteration plan.
- Verify latest branch with lint, type-check, unit tests, E2E, build, CDC gate,
  and ship preview.
- Prepare PR from latest integration branch to `main`.

Exit criteria:

- Current context files describe the real implementation.
- Worktree is clean.
- Latest branch is pushed.
- Full verification passes.
- Draft PR stack is reviewed and either merged or explicitly kept as a staged
  review stack.

### W1: Calculator Production Hardening

Goal: turn calculator coverage from route/engine completeness into formula
confidence.

Status: started through draft PR #2; not merged into the main stack.

Deliverables:

- Classify 73 calculators by risk: high-risk health, high-risk finance,
  medium-risk utility, low-risk simple math.
- Add golden value fixtures for high-risk calculators.
- Document formula source or migration basis per high-risk calculator.
- Add edge-case validation for impossible inputs and unsafe outputs.

Exit criteria:

- All high-risk calculators have at least two source-backed golden cases.
- Public calculator pages still pass no-login E2E.
- No calculator engine depends on React, browser APIs, network, auth, billing,
  or AI modules.

### W2: Real SaaS Backend

Goal: replace preview SaaS surfaces with production-capable backend seams.

Status: started. H1/H2/H3 route-level security seams have active stacked PRs,
but durable Auth/DB/provider implementations are still pending.

Deliverables:

- Confirm and implement Supabase Auth/Postgres or revised backend choice.
- Add schema for users, subscriptions, AI jobs, AI outputs, brand voices,
  usage counters, and saved calculator results.
- Replace preview session flow with real auth guard and app route protection.
- Integrate AI provider adapter behind a testable interface.
- Integrate Lemon Squeezy webhook idempotency and subscription state updates.
- Add a production env release gate that fails if preview auth is enabled in
  production.
- Add security event logging for AI and billing failures without logging secrets,
  raw payloads, or PII.

Exit criteria:

- Authenticated users can access AI app routes without preview query params.
- Free users are blocked from paid AI generation.
- Pro users can generate with usage metering.
- Webhook tests cover signature, replay/idempotency, and subscription update.
- Production builds cannot run with preview auth enabled.
- AI and billing failures emit structured, non-sensitive security events.

### W3: Release Readiness

Goal: prepare for public launch.

Deliverables:

- Run `cdc-role-security-audit` for auth, AI, billing, secrets, and API routes.
- Add application observability events for search, no-result searches,
  calculator opened/calculated/saved, AI generation lifecycle, and billing.
- Run accessibility and responsive QA across 320px, 390px, tablet, and desktop.
- Define performance budgets for public pages and AI routes.
- Prepare launch checklist, rollback SOP, and environment variable inventory.

Exit criteria:

- Security review has no unresolved high/critical findings.
- Production env requirements are documented.
- Public pages pass SEO, accessibility, responsive, build, and smoke gates.
- AI/billing release has rollback and incident response plan.

## 6. Immediate Next CDC Changes

Recommended order after the current #6-#9 security stack:

1. `production-env-release-gate`
2. `security-event-logging-pass`
3. `auth-db-production-implementation`
4. `ai-provider-adapter-implementation`
5. `billing-subscription-db-adapter`
6. `usage-metering-and-plan-gates`
7. `dependency-audit-remediation-pass`
8. `integrate-latest-stack-to-main`

W2 production backend work has started in route-level/security seams, but
durable Auth/DB/provider work should remain behind explicit specs and stacked
review until the current draft PR stack is reviewed.
