# Tasks: usage-metering-and-plan-gates

Execute in dependency order. Commit after each completed task group.

## 0. Preparation

- [x] 0.1 Create feature branch `feat/usage-metering-and-plan-gates`.
- [x] 0.2 Read AI route, plan definitions, runtime security, and billing DB
  adapter boundaries.

## 1. Spec And SQL Migration

- [x] 1.1 Add this CDC spec package.
  - Files: `specs/changes/usage-metering-and-plan-gates/**`
  - Verification: `test -f specs/changes/usage-metering-and-plan-gates/design.md`
- [x] 1.2 RED: add static SQL tests for `usage_counters`.
  - Files: `site/lib/db/__tests__/usage-migration.test.ts`
  - Covers: R1-S1, R4-S1
  - Verification: `pnpm --dir site test -- usage-migration`
- [x] 1.3 GREEN: add Supabase usage counter migration.
  - Files: `supabase/migrations/20260607133000_usage_counters.sql`
  - Verification: `pnpm --dir site test -- usage-migration`

## 2. Usage Repository

- [x] 2.1 RED: add usage period and in-memory repository tests.
  - Files: `site/lib/usage/__tests__/usage.test.ts`
  - Covers: R1-S1, R1-S2, R2-S1
  - Verification: `pnpm --dir site test -- usage`
- [x] 2.2 GREEN: implement usage domain and in-memory repository.
  - Files: `site/lib/usage/index.ts`
  - Verification: `pnpm --dir site test -- usage`
- [x] 2.3 RED: add Supabase usage adapter tests with fake query client.
  - Files: `site/lib/usage/__tests__/supabase.test.ts`
  - Covers: R1-S2, R2-S1, R4-S1
  - Verification: `pnpm --dir site test -- usage supabase`
- [x] 2.4 GREEN: implement server-only Supabase usage adapter and runtime factory.
  - Files: `site/lib/usage/supabase.ts`, `site/lib/usage/runtime.ts`
  - Verification: `pnpm --dir site test -- usage supabase runtime`

## 3. AI Route Plan-Gate Integration

- [x] 3.1 RED: update AI route tests to inject usage repository and assert
  success increments, limit reached denies, and free denial does not increment.
  - Files: `site/app/api/ai/repurpose/route.test.ts`
  - Covers: R2-S1, R2-S2, R3-S1, R3-S2
  - Verification: `pnpm --dir site test -- repurpose`
- [x] 3.2 GREEN: route AI plan checks through usage repository.
  - Files: `site/app/api/ai/repurpose/route.ts`
  - Verification: `pnpm --dir site test -- repurpose usage`

## 4. Verification And Closeout

- [x] 4.1 Run focused tests.
  - Verification: `pnpm --dir site test -- usage usage-migration repurpose public-calculator-isolation`
- [x] 4.2 Run standard gates.
  - Verification: `pnpm --dir site lint`, `pnpm --dir site type-check`,
    `pnpm --dir site test`, `pnpm --dir site build`,
    `cdc-workflow gate --mode standard --root .`
- [x] 4.3 Record CDC evidence and closeout.
  - Files: `.cdc/state/evidence.jsonl`, `.cdc/state/closeouts.jsonl`,
    `specs/changes/usage-metering-and-plan-gates/tasks.md`
