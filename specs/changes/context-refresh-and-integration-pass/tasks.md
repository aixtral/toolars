# Tasks: context-refresh-and-integration-pass

Documentation-only pass. TDD exception: no production code changes.

## 0. Preparation
- [x] 0.1 Create feature branch `feat/context-refresh-and-integration-pass`.
- [x] 0.2 Read current CDC context, architecture, branch stack, docs, specs, and site implementation facts.

## 1. Spec Baseline
- [x] 1.1 Create proposal, requirements, design, and tasks.
- [x] 1.2 Commit the spec baseline.

## 2. Context And Architecture Refresh
- [x] 2.1 Update `.cdc/CONTEXT.md` with current implementation, branch stack, verification baseline, and preview boundaries.
- [x] 2.2 Update `.cdc/ARCHITECTURE.md` with current module map, dependency boundaries, and open production architecture work.
- [x] 2.3 Add docs-level current status and iteration plan.
- [x] 2.4 Commit context refresh.

## 3. Verification And Ship
- [ ] 3.1 Run docs/context checks and CDC gate.
- [ ] 3.2 Run site lint, type-check, test, E2E, and build to ensure no hidden breakage.
- [ ] 3.3 Run CDC ship preview.
- [ ] 3.4 Append evidence ledger rows.
- [ ] 3.5 Commit task closure and push branch.
- [ ] 3.6 Compound learning decision: record `none` unless a repeatable process issue appears.
