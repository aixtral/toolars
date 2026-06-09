# Progress: pro-export-batch-usage-gates

## 2026-06-09 21:56 - Spec Created

- Completed: created branch `feat/pro-export-batch-usage-gates`.
- Completed: recorded project-owner-approved skip of real Supabase staging auth
  rehearsal until staging URL and test account are available.
- Completed: scoped implementation to PDF/CSV export and batch tool plan/usage
  gates because AI generation usage gates already exist.
- Next session start: read this file, then continue with task 2.1 RED tests in
  `site/lib/plans/__tests__/plans.test.ts`.

## 2026-06-09 21:58 - Plan And Usage Gates

- Completed: RED tests for export/batch plan gates and usage increments failed
  on missing helpers, repository methods, and SQL RPCs.
- Completed: added `monthlyExports`, `monthlyBatchRuns`,
  `evaluateExportAccess()`, and `evaluateBatchToolAccess()`.
- Completed: added `incrementExports()` and `incrementBatchRuns()` to preview
  and Supabase usage repositories, plus SQL RPCs.
- Evidence: `pnpm --dir site test -- plans usage usage-migration` passed with
  45 files and 163 tests.
- Next session start: continue with task 3.1 route RED tests for exports and
  batch tools.
