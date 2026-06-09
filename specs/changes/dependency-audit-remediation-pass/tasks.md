# Tasks: dependency-audit-remediation-pass

Execute in dependency order. Commit after each completed task group.

## 0. Preparation

- [x] 0.1 Create feature branch `feat/dependency-audit-remediation-pass`.
- [x] 0.2 Run baseline `pnpm outdated` and `pnpm audit` with official npm registry.
- [x] 0.3 Verify Next 16.2.7 still declares `postcss: 8.4.31`.

## 1. Spec And Dependency Guard

- [x] 1.1 Add this CDC spec package.
  - Files: `specs/changes/dependency-audit-remediation-pass/**`
  - Verification: `test -f specs/changes/dependency-audit-remediation-pass/design.md`
- [x] 1.2 RED: add dependency security test for vulnerable PostCSS in lockfile.
  - Files: `site/lib/security/__tests__/dependency-audit.test.ts`
  - Covers: R2-S1, R2-S2
  - Verification: `pnpm --dir site test -- dependency-audit`
- [x] 1.3 GREEN: add pnpm override and refresh lockfile.
  - Files: `site/pnpm-workspace.yaml`, `site/pnpm-lock.yaml`
  - Verification: `pnpm --dir site test -- dependency-audit`

## 2. Status Plan Refresh

- [x] 2.1 Update current status and iteration plan through PR #15.
  - Files: `docs/architecture/CURRENT-STATUS-AND-ITERATION-PLAN.md`
  - Covers: R4-S1
  - Verification: `rg "PR #15|usage-metering-and-plan-gates|dependency-audit-remediation-pass" docs/architecture/CURRENT-STATUS-AND-ITERATION-PLAN.md`

## 3. Verification And Closeout

- [x] 3.1 Run audit and focused tests.
  - Verification: `pnpm --dir site audit --registry=https://registry.npmjs.org --json`,
    `pnpm --dir site test -- dependency-audit`
- [x] 3.2 Run standard gates.
  - Verification: `pnpm --dir site lint`, `pnpm --dir site type-check`,
    `pnpm --dir site test`, `pnpm --dir site build`,
    `cdc-workflow gate --mode standard --root .`
- [x] 3.3 Record CDC evidence and closeout.
  - Files: `.cdc/state/evidence.jsonl`, `.cdc/state/closeouts.jsonl`,
    `specs/changes/dependency-audit-remediation-pass/tasks.md`
