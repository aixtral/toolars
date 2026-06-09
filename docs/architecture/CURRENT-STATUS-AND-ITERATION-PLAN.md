# toolars Current Status And Iteration Plan

Status: W2 backend-productionization top-stack integration review  
Updated: 2026-06-09  
Source branch: `feat/integrate-latest-stack-to-main`

## 1. Executive Summary

Toolars has moved from design handoff to a runnable Next.js App Router
implementation and through the main W2 backend-productionization stack. The
current integration branch includes the public utility shell, 73 calculator routes,
calculator detail workspaces, AI SaaS preview pages, commercial/legal pages,
SEO/GEO discovery surfaces, URL-driven tools directory search, security release
gates, `/app/**` route guarding, AI runtime request limits, Lemon
Squeezy-shaped billing webhook intake, Supabase Auth/Postgres foundation, AI
provider adapters, durable billing subscription adapters, workspace usage
metering, dependency audit remediation, and the governance-only branch that
prepares the latest stack for review against `main`.

The project is not yet production SaaS complete. The public site and preview
application are strong enough for integration review, and the major W2 backend
seams now have explicit implementation PRs. Remaining release blockers are
review and merge sequencing to `main`, final security/release review, production
environment provisioning, real provider credentials, application observability,
AI persistence/history, Pro export persistence, and calculator golden-source
hardening.

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
| Auth | `/app/**` guard, production preview-auth release gate, Supabase env/client helpers, workspace SQL, and session resolver foundation exist; runtime sign-in/session cookie integration still needs production env/provider rehearsal |
| AI runtime | Request/body/source limits, platform normalization, provider-neutral adapter, preview provider, AI SDK wrapper, and workspace usage metering exist |
| Billing | Lemon Squeezy `X-Signature` parser, idempotency model, durable Supabase `subscription_events`/`subscriptions` adapter, and runtime repository injection exist |
| Usage metering | Workspace monthly `usage_counters`, atomic AI generation increment RPC, preview repository, and Supabase adapter exist |
| SEO/GEO | sitemap, robots, llms.txt, root Open Graph/Twitter, Organization/WebSite/SearchAction JSON-LD |
| Tests | Vitest/Testing Library and Playwright |

Latest verification evidence on the current stack:

```text
pnpm --dir site lint        -> pass
pnpm --dir site type-check  -> pass
pnpm --dir site test        -> 44 files / 147 tests passed
pnpm --dir site test:e2e -> 38 tests passed
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
| `feat/production-env-release-gate` | Production env release gate; preview auth fails closed in production |
| `feat/security-event-logging-pass` | Structured non-sensitive AI and billing security event logging |
| `feat/auth-db-production-implementation` | Supabase env/client/session and workspace SQL foundation |
| `feat/ai-provider-adapter-implementation` | Provider-neutral AI adapter, preview provider, AI SDK wrapper, provider metadata |
| `feat/billing-subscription-db-adapter` | Durable Supabase billing event/subscription repository and webhook runtime injection |
| `feat/usage-metering-and-plan-gates` | Workspace monthly usage metering and AI plan gates |
| `feat/dependency-audit-remediation-pass` | PostCSS advisory remediation and status refresh |
| `feat/integrate-latest-stack-to-main` | Current local pass: top-stack context/architecture refresh, full verification, and draft PR to `main` |

Recommended merge strategy:

1. Keep PR #1 from `feat/context-refresh-and-integration-pass` to `main` as the
   W0 integration anchor until the stacked security PRs are reviewed.
2. Review the stacked security/backend PRs in order: #6 security audit, #7 auth
   route guard, #8 AI runtime security, #9 billing webhook production intake,
   #10 production env gate, #11 security event logging, #12 auth DB foundation,
   #13 AI provider adapter, #14 billing DB adapter, #15 usage metering, and
   #16 dependency audit remediation.
3. Re-run the full verification gate on the top stack branch before marking any
   draft PR ready.
4. Merge only after confirming no hidden branch-stack drift and after deciding
   whether W1/W2 parallel design branches should be rebased into the same stack
   or reviewed independently.

Open draft PR state as of 2026-06-09:

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
| #10 | `feat/production-env-release-gate` | `feat/billing-webhook-production-pass` | open draft |
| #11 | `feat/security-event-logging-pass` | `feat/production-env-release-gate` | open draft |
| #12 | `feat/auth-db-production-implementation` | `feat/security-event-logging-pass` | open draft |
| #13 | `feat/ai-provider-adapter-implementation` | `feat/auth-db-production-implementation` | open draft |
| #14 | `feat/billing-subscription-db-adapter` | `feat/ai-provider-adapter-implementation` | open draft |
| #15 | `feat/usage-metering-and-plan-gates` | `feat/billing-subscription-db-adapter` | open draft; PR #15 usage-metering milestone |
| #16 | `feat/dependency-audit-remediation-pass` | `feat/usage-metering-and-plan-gates` | open draft; dependency advisory remediation |

The active integration branch `feat/integrate-latest-stack-to-main` is expected
to open a draft PR to `main` after full local verification. It should remain a
review anchor, not an implicit merge approval for the stacked PRs.

## 4. Preview Boundaries

These systems are intentionally preview or MVP-level and must not be described
as production-complete:

| System | Current boundary | Required production work |
|---|---|---|
| Auth | `/app/**` proxy guard, production preview-auth release gate, Supabase env/client helpers, workspace SQL, and session resolver foundation exist | Production sign-in/session rehearsal, provider env, and route-level switch from preview headers to real cookies |
| AI generation | Deterministic preview provider plus AI SDK adapter, request/source limits, provider metadata, and workspace usage gate exist | Real provider credentials, streaming transport, retries/backoff, cost persistence, AI job/output history |
| Billing | Lemon Squeezy intake, parser, idempotency, durable Supabase billing repository, and webhook runtime injection exist | Checkout/portal handoff, subscription reconciliation UI, operational webhook replay tooling |
| Usage | Workspace monthly AI usage counters and atomic increment exist | Export/batch usage counters and customer-facing usage history |
| Persistence | Local storage for anonymous calculator saves/comparisons | Account-backed saved results, cross-device sync, Pro export history |
| Observability | CDC evidence and automated tests | Application analytics/events, error reporting, trace IDs for AI and billing |
| Security | Release audit, route guard, request limits, webhook intake, production env gate, security event logging, and current dependency remediation exist | Final production security audit after stack integration |
| Calculator formulas | All routes have formula engines; high-risk formulas have representative tests | Golden value suites and source review for high-risk finance/health calculators |

## 5. Iteration Plan

### W0: Integration And Context Reset

Goal: make the latest stack the reviewable source of truth.

Status: active on `feat/integrate-latest-stack-to-main`; not merged to `main`.

Deliverables:

- Refresh `.cdc/CONTEXT.md`, `.cdc/ARCHITECTURE.md`, and this status plan
  through PR #16.
- Verify the top-stack branch with dependency audit, lint, type-check, unit
  tests, E2E, build, CDC gate, and ship preview.
- Prepare a draft PR from `feat/integrate-latest-stack-to-main` to `main`.

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

Status: active stacked PRs through usage metering. Durable Auth/DB/provider,
billing DB adapter, and AI usage-metering seams now have implementation PRs.
Production credentials, streaming UX, AI persistence, and release rehearsal
remain pending.

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

Recommended order after the current top-stack integration pass:

1. `integrate-latest-stack-to-main` - in progress on
   `feat/integrate-latest-stack-to-main`.
2. `final-production-security-audit`
3. `ai-persistence-history-pass`
4. `checkout-portal-handoff-pass`
5. `pro-export-persistence-pass`
6. `calculator-golden-source-hardening`

W2 backend work is now represented by explicit stacked draft PRs. The next
coordination milestone is to finish the top-stack integration review before
advancing `main`.
