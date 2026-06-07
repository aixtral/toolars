# Tasks: billing-subscription-db-adapter

Execute in dependency order. Commit after each completed task group.

## 0. Preparation

- [x] 0.1 Create feature branch `feat/billing-subscription-db-adapter`.
- [x] 0.2 Read `.cdc/CONTEXT.md`, `.cdc/ARCHITECTURE.md`,
  `billing-subscription-state-pass`, and `auth-db-production-implementation`.

## 1. Spec And SQL Migration

- [x] 1.1 Add this CDC spec package.
  - Files: `specs/changes/billing-subscription-db-adapter/**`
  - Verification: `test -f specs/changes/billing-subscription-db-adapter/design.md`
- [x] 1.2 RED: add static SQL tests for billing tables, constraints, indexes,
  RLS, and service-role grants.
  - Files: `site/lib/db/__tests__/billing-migration.test.ts`
  - Covers: R1-S1, R1-S2, R2-S1, R3-S1
  - Verification: `pnpm --dir site test -- billing-migration`
- [x] 1.3 GREEN: add Supabase billing migration.
  - Files: `supabase/migrations/20260607123000_billing_subscription_state.sql`
  - Verification: `pnpm --dir site test -- billing-migration`

## 2. Supabase Billing Repository Adapter

- [ ] 2.1 RED: add adapter tests with a fake Supabase query client.
  - Files: `site/lib/billing/__tests__/supabase.test.ts`
  - Covers: R1-S1, R1-S2, R2-S1, R2-S2, R3-S1
  - Verification: `pnpm --dir site test -- billing supabase`
- [ ] 2.2 GREEN: implement `createSupabaseBillingRepository`.
  - Files: `site/lib/billing/supabase.ts`, `site/lib/billing/index.ts`
  - Verification: `pnpm --dir site test -- billing supabase`

## 3. Webhook Runtime Integration

- [ ] 3.1 RED: update webhook route tests to inject a repository and assert the
  route uses it.
  - Files: `site/app/api/billing/webhook/route.test.ts`
  - Covers: R4-S1, R4-S2
  - Verification: `pnpm --dir site test -- route`
- [ ] 3.2 GREEN: add billing runtime factory and route injection.
  - Files: `site/lib/billing/runtime.ts`,
    `site/app/api/billing/webhook/route.ts`
  - Verification: `pnpm --dir site test -- billing route`

## 4. Verification And Closeout

- [ ] 4.1 Run focused tests.
  - Verification: `pnpm --dir site test -- billing billing-migration route public-calculator-isolation`
- [ ] 4.2 Run standard gates.
  - Verification: `pnpm --dir site lint`, `pnpm --dir site type-check`,
    `pnpm --dir site test`, `pnpm --dir site build`,
    `cdc-workflow gate --mode standard --root .`
- [ ] 4.3 Record CDC evidence and closeout.
  - Files: `.cdc/state/evidence.jsonl`, `.cdc/state/closeouts.jsonl`,
    `specs/changes/billing-subscription-db-adapter/tasks.md`
