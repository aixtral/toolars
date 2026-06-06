# Tasks: calculator-golden-fixtures-pass

Follow TDD for production code changes.

## 0. Preparation

- [x] 0.1 Create feature branch `feat/calculator-golden-fixtures-pass`.
- [x] 0.2 Read `.cdc/CONTEXT.md`, `.cdc/ARCHITECTURE.md`, current iteration plan, calculator registry, engine, and tests.

## 1. Spec Baseline

- [x] 1.1 Create proposal, requirements, design, and tasks.
- [x] 1.2 Commit spec baseline.

## 2. Red: Calculator Quality Tests

- [x] 2.1 Add failing tests for calculator risk metadata completeness.
  - Files: `site/lib/calculators/__tests__/calculators.test.ts`
  - Covers: R1-S1, R1-S2
- [x] 2.2 Add failing tests for high-risk golden fixtures and source URLs.
  - Files: `site/lib/calculators/__tests__/calculators.test.ts`
  - Covers: R2-S1, R2-S2
- [x] 2.3 Add failing tests for BMI, blood pressure, and debt payoff unsafe-output boundaries.
  - Files: `site/lib/calculators/__tests__/calculators.test.ts`
  - Covers: R3-S1, R3-S2

## 3. Green: Quality Registry And Formula Fixes

- [x] 3.1 Implement calculator quality profiles and golden fixture helpers.
  - Files: `site/lib/calculators/quality.ts`
  - Covers: R1-S1, R1-S2, R2-S1
- [x] 3.2 Add source-backed golden fixtures for the first high-risk health and finance set.
  - Files: `site/lib/calculators/quality.ts`
  - Covers: R2-S1, R2-S2
- [x] 3.3 Fix formula/category defects exposed by the golden tests.
  - Files: `site/lib/calculators/index.ts`
  - Covers: R3-S1, R3-S2
- [x] 3.4 Run focused calculator tests and commit implementation.

## 4. Verification And Ship

- [ ] 4.1 Run purity grep for calculator engine modules.
- [ ] 4.2 Run site lint, type-check, unit tests, focused E2E, and build.
- [ ] 4.3 Run CDC gate and ship preview.
- [ ] 4.4 Append evidence ledger rows.
- [ ] 4.5 Commit task closure and push branch.
- [ ] 4.6 Compound learning decision: record `none` unless a repeatable process issue appears.
