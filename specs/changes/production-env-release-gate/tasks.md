# Tasks: production-env-release-gate

Production code pass. TDD required.

## 0. Preparation

- [x] 0.1 Create feature branch `feat/production-env-release-gate`.
- [x] 0.2 Review H4 and current preview auth helper.
- [x] 0.3 Update `CURRENT-STATUS-AND-ITERATION-PLAN.md` for #6-#9 progress.

## 1. Spec Baseline

- [x] 1.1 Create proposal, requirements, design, and tasks.
- [x] 1.2 Commit spec baseline.

## 2. TDD Red

- [x] 2.1 Add failing env gate tests for production preview auth and local
  preview policy.
  - covers: R1-S1, R2-S1, R2-S2
- [x] 2.2 Update auth tests to expect production preview sessions to stay
  disabled even when `TOOLARS_ENABLE_PREVIEW_AUTH=true`.
  - covers: R1-S2
- [x] 2.3 Commit RED tests after confirming focused tests fail.

## 3. Implementation Green

- [x] 3.1 Add `site/lib/env/release-gate.ts`.
- [x] 3.2 Wire `site/lib/auth/index.ts` to the release-gate preview policy.
- [x] 3.3 Wire `site/next.config.ts` to assert production env.
- [x] 3.4 Run focused tests until green.
- [x] 3.5 Commit implementation.

## 4. Verification And Ship

- [ ] 4.1 Run focused auth/env tests.
- [ ] 4.2 Run lint, type-check, full unit tests, and build.
- [ ] 4.3 Run CDC gate and ship preview.
- [ ] 4.4 Append evidence ledger rows.
- [ ] 4.5 Commit task closure, push branch, and create draft PR.
- [ ] 4.6 Compound learning decision: record `none` unless a repeatable process
  issue appears.
