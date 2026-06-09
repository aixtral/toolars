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

- [x] 2.1 Add failing proxy tests for anonymous redirect, public route bypass,
  preview query allow, preview cookie allow, and production preview block.
- [x] 2.2 Commit RED tests after confirming the focused test command fails.

## 3. Implementation Green

- [x] 3.1 Add `site/proxy.ts` app route guard.
- [x] 3.2 Preserve preview navigation ergonomics for app pages.
- [x] 3.3 Run focused tests until green.
- [x] 3.4 Commit implementation.

## 4. Verification And Ship

- [x] 4.1 Run focused unit/E2E checks plus lint/type-check.
- [x] 4.2 Run CDC gate and ship preview.
- [x] 4.3 Append evidence ledger rows.
- [x] 4.4 Commit task closure and push branch.
- [x] 4.5 Compound learning decision: `none`; no repeatable process
  issue appears.
