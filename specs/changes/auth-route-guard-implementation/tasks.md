# Tasks: auth-route-guard-implementation

Production code pass. TDD required.

## 0. Preparation

- [x] 0.1 Create feature branch `feat/auth-route-guard-implementation`.
- [x] 0.2 Read security audit H1, Next.js 16 proxy docs, current auth helpers,
  app pages, and auth/billing tests.
- [x] 0.3 Run CDC gate before implementation.

## 1. Spec Baseline

- [x] 1.1 Create proposal, requirements, design, and tasks.
- [x] 1.2 Commit spec baseline.

## 2. TDD Red

- [ ] 2.1 Add failing proxy tests for anonymous redirect, public route bypass,
  preview query allow, preview cookie allow, and production preview block.
- [ ] 2.2 Commit RED tests after confirming the focused test command fails.

## 3. Implementation Green

- [ ] 3.1 Add `site/proxy.ts` app route guard.
- [ ] 3.2 Preserve preview navigation ergonomics for app pages.
- [ ] 3.3 Run focused tests until green.
- [ ] 3.4 Commit implementation.

## 4. Verification And Ship

- [ ] 4.1 Run focused unit/E2E checks plus lint/type-check.
- [ ] 4.2 Run CDC gate and ship preview.
- [ ] 4.3 Append evidence ledger rows.
- [ ] 4.4 Commit task closure and push branch.
- [ ] 4.5 Compound learning decision: record `none` unless a repeatable process
  issue appears.
