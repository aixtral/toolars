# Tasks: tools-query-search-pass

Execute in dependency order. Each implementation task should land with evidence.

## 0. Preparation
- [x] 0.1 Create feature branch `feat/tools-query-search-pass`.
- [x] 0.2 Read `.cdc/CONTEXT.md`, `.cdc/ARCHITECTURE.md`, current tools page, search helper, discovery helper, and existing tests.

## 1. Spec Baseline
- [x] 1.1 Create proposal, requirements, design, and tasks.
- [x] 1.2 Commit the spec baseline.

## 2. Red Phase
- [x] 2.1 Add unit tests for default `/tools` and `/tools?search=inflation`.
  - Files: `site/app/__tests__/tools-page.test.tsx`
  - Covers: R1-S1, R2-S1
- [x] 2.2 Add E2E tests for query search and empty state.
  - Files: `site/e2e/search.spec.ts`
  - Covers: R2-S1, R2-S2
- [x] 2.3 Run focused tests and record the expected failing result.

## 3. Green Phase
- [x] 3.1 Implement `searchParams` handling in `site/app/tools/page.tsx`.
- [x] 3.2 Render query summary, populated search input, and empty state.
- [x] 3.3 Run focused tests and confirm green.
- [x] 3.4 Commit tests and implementation.

## 4. Verification And Ship
- [ ] 4.1 Run lint, type-check, unit tests, E2E, and build.
- [ ] 4.2 Run CDC gate and ship preview.
- [ ] 4.3 Run browser smoke on `http://127.0.0.1:9088/tools?search=inflation`.
- [ ] 4.4 Commit task closure and push branch.
- [ ] 4.5 Compound learning decision: record `none` unless a repeatable process issue appears.
