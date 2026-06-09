# Tasks: integrate-latest-stack-to-main

This is a governance/integration pass. TDD exception: no production code should
change; verification is command- and evidence-driven.

## 0. Preparation

- [x] 0.1 Confirm current top-stack branch is clean.
- [x] 0.2 Fetch `origin/main` and confirm `origin/main` is an ancestor of the
  current top stack.
- [x] 0.3 Create branch `feat/integrate-latest-stack-to-main`.

## 1. Spec And Context Refresh

- [x] 1.1 Add this CDC spec package.
  - Files: `specs/changes/integrate-latest-stack-to-main/**`
  - Verification: `test -f specs/changes/integrate-latest-stack-to-main/design.md`
- [ ] 1.2 Refresh CDC context and architecture through PR #16.
  - Files: `.cdc/CONTEXT.md`, `.cdc/ARCHITECTURE.md`,
    `docs/architecture/CURRENT-STATUS-AND-ITERATION-PLAN.md`
  - Covers: R2-S1, R2-S2
  - Verification: `rg "dependency-audit-remediation-pass|PostCSS|usage_counters|subscription_events|AI SDK" .cdc docs/architecture/CURRENT-STATUS-AND-ITERATION-PLAN.md`

## 2. Verification

- [ ] 2.1 Run package/security and unit verification.
  - Verification: `pnpm --dir site audit --json --registry=https://registry.npmjs.org`,
    `pnpm --dir site lint`, `pnpm --dir site type-check`,
    `pnpm --dir site test`, `pnpm --dir site build`,
    `cdc-workflow gate --mode standard --root .`
- [ ] 2.2 Run Playwright E2E.
  - Verification: `pnpm --dir site test:e2e`
- [ ] 2.3 Run integration ship preview.
  - Verification: `cdc-workflow ship-preview --change integrate-latest-stack-to-main --root .`

## 3. PR And Closeout

- [ ] 3.1 Push `feat/integrate-latest-stack-to-main`.
- [ ] 3.2 Create draft PR targeting `main`.
- [ ] 3.3 Record CDC evidence and closeout.
  - Files: `.cdc/state/evidence.jsonl`, `.cdc/state/closeouts.jsonl`,
    `specs/changes/integrate-latest-stack-to-main/tasks.md`
