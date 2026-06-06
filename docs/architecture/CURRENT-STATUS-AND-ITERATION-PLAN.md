# toolars Current Status And Iteration Plan

Status: current branch-stack review baseline  
Updated: 2026-06-06  
Source branch: `feat/tools-query-search-pass`

## 1. Executive Summary

Toolars has moved from design handoff to a runnable Next.js App Router
implementation. The current branch stack includes the public utility shell,
73 calculator routes, calculator detail workspaces, AI SaaS preview pages,
commercial/legal pages, SEO/GEO discovery surfaces, and URL-driven tools
directory search.

The project is not yet production SaaS complete. The public site and preview
application are strong enough for integration review, but real auth, database
persistence, AI provider integration, billing subscription state, application
observability, and security audit remain release-blocking work.

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
| Auth | Preview sessions only; no production provider yet |
| Billing | Plan gates and webhook signature parsing only; no subscription persistence yet |
| SEO/GEO | sitemap, robots, llms.txt, root Open Graph/Twitter, Organization/WebSite/SearchAction JSON-LD |
| Tests | Vitest/Testing Library and Playwright |

Latest verification evidence on the current stack:

```text
pnpm --dir site lint        -> pass
pnpm --dir site type-check  -> pass
pnpm --dir site test        -> 25 files / 78 tests passed
pnpm --dir site test:e2e    -> 38 tests passed
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

Recommended merge strategy:

1. Treat `feat/context-refresh-and-integration-pass` as the latest integration
   candidate after this pass lands.
2. Open or update a PR from the latest integration candidate into `main`.
3. Run the full verification gate on the PR branch.
4. Merge only after confirming no hidden branch-stack drift.

## 4. Preview Boundaries

These systems are intentionally preview or MVP-level and must not be described
as production-complete:

| System | Current boundary | Required production work |
|---|---|---|
| Auth | Query/header preview sessions; disabled in production unless explicitly enabled | Real provider, session cookies, protected route middleware, user profile storage |
| AI generation | Deterministic local draft generation | Provider adapters, streaming route behavior, retries, rate limits, cost tracking, logging |
| Billing | Plan definitions and webhook signature helper | Lemon Squeezy event handling, subscription table, user-plan reconciliation, idempotency |
| Persistence | Local storage for anonymous calculator saves/comparisons | Account-backed saved results, cross-device sync, Pro export history |
| Observability | CDC evidence and automated tests | Application analytics/events, error reporting, trace IDs for AI and billing |
| Security | Helper-level tests | Full security audit for auth, billing, AI input, secrets, webhook replay, rate limits |
| Calculator formulas | All routes have formula engines; high-risk formulas have representative tests | Golden value suites and source review for high-risk finance/health calculators |

## 5. Iteration Plan

### W0: Integration And Context Reset

Goal: make the latest stack the reviewable source of truth.

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

### W1: Calculator Production Hardening

Goal: turn calculator coverage from route/engine completeness into formula
confidence.

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

Deliverables:

- Confirm and implement Supabase Auth/Postgres or revised backend choice.
- Add schema for users, subscriptions, AI jobs, AI outputs, brand voices,
  usage counters, and saved calculator results.
- Replace preview session flow with real auth guard and app route protection.
- Integrate AI provider adapter behind a testable interface.
- Integrate Lemon Squeezy webhook idempotency and subscription state updates.

Exit criteria:

- Authenticated users can access AI app routes without preview query params.
- Free users are blocked from paid AI generation.
- Pro users can generate with usage metering.
- Webhook tests cover signature, replay/idempotency, and subscription update.

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

Recommended order after this pass:

1. `integrate-latest-stack-to-main`
2. `calculator-golden-fixtures-pass`
3. `auth-db-production-design`
4. `ai-provider-adapter-pass`
5. `billing-subscription-state-pass`
6. `security-audit-release-gate`

Do not start W2 production backend work until W0 integration is complete.
