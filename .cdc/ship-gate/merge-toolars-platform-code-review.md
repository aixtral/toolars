# Code Review: merge-toolars-platform

Date: 2026-05-31
Branch: `feat/merge-toolars-platform`
Scope: CDC change `merge-toolars-platform`, tasks T-001 through T-014.

## Phase A: Spec Compliance

- [pass] P1/P2/P3 covered: repo guardrails, `site/` ownership, unified calculator plus AI discovery, and English-first metadata are implemented and documented.
- [pass] D1/D2/D3 covered: UI uses the shared token/component system, search-first public pages, keyboard command palette, mobile viewport coverage, and no marketing-only hero as the primary screen.
- [pass] T1/T2/T3 covered: 73 calculator slugs have public routes, discovery/search coverage, anonymous calculator E2E, pure formula tests, and invalid input behavior tests.
- [pass] A1/A2/A3 covered: AI app shell, account-gated repurpose route, supporting SaaS pages, platform inventory, generation, and cancel flows are represented in tests.
- [pass] M1/M2 covered: calculator basics remain free, Pro prompts do not block local results, free preview AI generation is blocked, and Pro preview generation is allowed.
- [pass] I1/I2 covered: English default metadata/content, locale registry, hreflang-ready helpers, and RTL-aware locale metadata are implemented.
- [pass] YAGNI check: implementation remains file/static-data based for v1; no CMS, database, payment provider SDK, or external AI provider was added beyond the approved mockable surface.

## Phase B: Code Quality

### Security

- [fixed] Preview auth headers were accepted in production. `site/lib/auth/index.ts:25` now disables preview sessions in production unless `TOOLARS_ENABLE_PREVIEW_AUTH=true`; regression test: `site/lib/auth/__tests__/auth.test.ts:48`.
- [fixed] Billing webhook route could use a public development fallback secret in production. `site/app/api/billing/webhook/route.ts:8` now fails closed when `TOOLARS_BILLING_WEBHOOK_SECRET` is missing in production; regression test: `site/app/api/billing/webhook/route.test.ts:63`.
- [fixed] Billing webhook status values were trusted via TypeScript cast only. `site/lib/billing/index.ts:35` now validates runtime status values; regression test: `site/lib/billing/__tests__/billing.test.ts:47`.
- [pass] No SQL/SSRF surface found in current code; there are no database drivers or external fetches in public calculator paths.
- [pass] JSON-LD uses `serializeJsonLd` and static trusted data before `dangerouslySetInnerHTML`; no user-provided script content is rendered.

### Correctness

- [pass] Calculator logic remains pure and registry-driven, with representative formula and validation fixtures.
- [pass] AI route validates JSON, source content, platform IDs, tone, brand voice, model, and plan gates before generation.
- [pass] Public routes produce static or SSG output where expected; `/tools/[slug]` covers 73 paths and `/blog/[slug]` covers 3 paths.

### Performance

- [pass] Public pages use static registries and SSG routes; no N+1 query or synchronous network dependency exists in render paths.
- [pass] Search and discovery operate on bounded in-memory registries for the current 73 calculators plus AI tools.

### Tests

- [pass] Unit/component/E2E coverage exists for registry inventory, calculators, search, public pages, SEO, AI flows, auth/billing gates, and design primitives.
- [pass] No `.only`, `.skip`, `console.log`, `TODO`, or `FIXME` were found in tracked app/spec files during review grep.
- [pass] New security regressions were added with failing RED runs before production fixes.

### LLM Trust Boundary

- [pass] No `eval`, `new Function`, shell execution, SQL composition, or direct execution of AI output.
- [pass] AI generation is currently deterministic/mockable and does not call external providers from user input.
- [pass] User source text is summarized into outputs but not executed or used as instructions for local tooling.
- [pass] Preview auth is production-disabled by default after this review.
- [pass] Billing webhook signatures and runtime payload enums are validated before accepting subscription events.

## Verdict

Blocking merge: no open blocker after the fixes in this review pass.

Required fixes completed in this pass:

- `SEC-001`: production preview auth bypass fixed at `site/lib/auth/index.ts:25`.
- `SEC-002`: production billing webhook default secret fixed at `site/app/api/billing/webhook/route.ts:8`.
- `SEC-003`: billing webhook status runtime validation fixed at `site/lib/billing/index.ts:35`.

Recommended ship condition: run the final verification suite after committing this review fix set.
