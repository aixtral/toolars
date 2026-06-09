# Tasks: billing-checkout-portal-handoff

Execute in dependency order. Commit after each completed task group.

## 0. Preparation

- [x] 0.1 Create feature branch `feat/billing-checkout-portal-handoff`.
- [x] 0.2 Read current billing repository/runtime, webhook parser, auth session,
  billing component, and Lemon Squeezy official checkout/portal docs.

## 1. Spec Package

- [x] 1.1 Add this CDC spec package.
  - Files: `specs/changes/billing-checkout-portal-handoff/**`
  - Covers: R1-S1, R1-S2, R1-S3, R2-S1, R2-S2, R2-S3, R3-S1
  - Verification: `test -f specs/changes/billing-checkout-portal-handoff/design.md`

## 2. Billing Handoff Domain

- [ ] 2.1 RED: add tests for checkout URL config, custom data decoration, and
  safe HTTPS validation.
  - Files: `site/lib/billing/__tests__/handoff.test.ts`
  - Covers: R1-S2, R1-S3
  - Verification: `pnpm --dir site test -- handoff`
- [ ] 2.2 GREEN: implement billing handoff helpers.
  - Files: `site/lib/billing/handoff.ts`
  - Verification: `pnpm --dir site test -- handoff`
- [ ] 2.3 RED: add repository helper tests for workspace subscription lookup.
  - Files: `site/lib/billing/__tests__/billing.test.ts`,
    `site/lib/billing/__tests__/supabase.test.ts`
  - Covers: R2-S1
  - Verification: `pnpm --dir site test -- billing supabase`
- [ ] 2.4 GREEN: extend billing repository with workspace subscription lookup.
  - Files: `site/lib/billing/index.ts`, `site/lib/billing/supabase.ts`
  - Verification: `pnpm --dir site test -- billing supabase`

## 3. Checkout And Portal Routes

- [ ] 3.1 RED: add checkout and portal route tests for auth, missing config,
  redirect, and fallback behavior.
  - Files: `site/app/api/billing/checkout/route.test.ts`,
    `site/app/api/billing/portal/route.test.ts`
  - Covers: R1-S1, R1-S2, R1-S3, R2-S1, R2-S2, R2-S3
  - Verification: `pnpm --dir site test -- checkout portal`
- [ ] 3.2 GREEN: implement checkout and portal route handlers.
  - Files: `site/app/api/billing/checkout/route.ts`,
    `site/app/api/billing/portal/route.ts`
  - Verification: `pnpm --dir site test -- checkout portal`

## 4. Billing UI Hooks

- [ ] 4.1 RED: update billing component tests for checkout and manage links.
  - Files: `site/components/billing/__tests__/billing.test.tsx`
  - Covers: R1-S3, R2-S1
  - Verification: `pnpm --dir site test -- billing-cards`
- [ ] 4.2 GREEN: wire Upgrade/Manage controls to billing routes.
  - Files: `site/components/billing/billing-cards.tsx`
  - Verification: `pnpm --dir site test -- billing-cards`

## 5. Verification And Closeout

- [ ] 5.1 Run focused tests.
  - Verification: `pnpm --dir site test -- handoff checkout portal billing supabase public-calculator-isolation`
- [ ] 5.2 Run standard gates.
  - Verification: `pnpm --dir site lint`, `pnpm --dir site type-check`,
    `pnpm --dir site test`, `pnpm --dir site build`,
    `cdc-workflow gate --mode standard --root .`
- [ ] 5.3 Record CDC evidence, progress, closeout, and create draft PR.
  - Files: `.cdc/state/evidence.jsonl`, `.cdc/state/closeouts.jsonl`,
    `specs/changes/billing-checkout-portal-handoff/progress.md`,
    `specs/changes/billing-checkout-portal-handoff/tasks.md`
