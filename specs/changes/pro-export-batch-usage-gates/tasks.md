# Tasks: pro-export-batch-usage-gates

Execute in dependency order. Commit after each completed task group.

## 0. Preparation

- [x] 0.1 Create feature branch `feat/pro-export-batch-usage-gates`.
- [x] 0.2 Confirm project owner approved skipping real staging auth rehearsal
  until staging URL and test account exist.
- [x] 0.3 Read current plans, usage repository, AI plan-gate route, and public
  calculator isolation boundary.

## 1. Spec Package

- [x] 1.1 Add this CDC spec package.
  - Files: `specs/changes/pro-export-batch-usage-gates/**`
  - Covers: R1-S1, R1-S2, R1-S3, R2-S1, R2-S2, R3-S1
  - Verification: `test -f specs/changes/pro-export-batch-usage-gates/design.md`

## 2. Plan And Usage Domain

- [x] 2.1 RED: add plan-gate tests for export and batch monthly limits.
  - Files: `site/lib/plans/__tests__/plans.test.ts`
  - Covers: R1-S1, R1-S3, R2-S1
  - Verification: `pnpm --dir site test -- plans`
- [x] 2.2 GREEN: extend plan definitions and gate helpers.
  - Files: `site/lib/plans/index.ts`
  - Verification: `pnpm --dir site test -- plans`
- [x] 2.3 RED: add usage repository tests for export and batch increments.
  - Files: `site/lib/usage/__tests__/usage.test.ts`,
    `site/lib/usage/__tests__/supabase.test.ts`,
    `site/lib/db/__tests__/usage-migration.test.ts`
  - Covers: R1-S2, R2-S2
  - Verification: `pnpm --dir site test -- usage usage-migration`
- [x] 2.4 GREEN: extend usage repository, Supabase adapter, and SQL RPCs.
  - Files: `site/lib/usage/index.ts`, `site/lib/usage/supabase.ts`,
    `supabase/migrations/20260607133000_usage_counters.sql`
  - Verification: `pnpm --dir site test -- usage usage-migration`

## 3. Export And Batch API Routes

- [x] 3.1 RED: add route tests for missing session, free denial, successful
  Pro export increment, export limit denial, and successful batch increment.
  - Files: `site/app/api/exports/csv/route.test.ts`,
    `site/app/api/exports/pdf/route.test.ts`,
    `site/app/api/batch/tools/route.test.ts`
  - Covers: R1-S1, R1-S2, R1-S3, R2-S1, R2-S2
  - Verification: `pnpm --dir site test -- exports batch`
- [x] 3.2 GREEN: implement export and batch route handlers.
  - Files: `site/app/api/exports/csv/route.ts`,
    `site/app/api/exports/pdf/route.ts`, `site/app/api/batch/tools/route.ts`
  - Verification: `pnpm --dir site test -- exports batch`

## 4. Verification And Closeout

- [x] 4.1 Run focused tests.
  - Verification: `pnpm --dir site test -- plans usage usage-migration exports batch public-calculator-isolation`
- [x] 4.2 Run standard gates.
  - Verification: `pnpm --dir site lint`, `pnpm --dir site type-check`,
    `pnpm --dir site test`, `pnpm --dir site build`,
    `cdc-workflow gate --mode standard --root .`
- [x] 4.3 Record CDC evidence, progress, closeout, and create draft PR.
  - Files: `.cdc/state/evidence.jsonl`, `.cdc/state/closeouts.jsonl`,
    `specs/changes/pro-export-batch-usage-gates/progress.md`,
    `specs/changes/pro-export-batch-usage-gates/tasks.md`
