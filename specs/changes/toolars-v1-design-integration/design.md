# Design: toolars-v1-design-integration

## Architecture

This change is a branch integration pass. It does not introduce a new module
shape; it combines the existing cumulative stack with the calculator detail
workspace pass and verifies the resulting tree.

```text
feat/seo-discovery-manifests-pass
  includes public commercial routes
  includes AI SaaS page polish
  includes AI repurpose dashboard polish

origin/feat/calculator-detail-design-pass
  includes calculator detail workspace redesign

feat/toolars-v1-design-integration
  includes both stacks and full verification evidence
```

## ADR-1: Integrate Calculator Detail Pass Before New Feature Work

**Context**: The current cumulative branch does not contain the calculator
detail redesign branch.

**Decision**: Create a dedicated integration branch and merge
`origin/feat/calculator-detail-design-pass` before continuing to additional
feature work.

**Consequences**: Reviewers can evaluate the public, AI, SEO, and calculator
detail work together. Any conflicts are handled once in the integration branch
instead of being rediscovered later.

## ADR-2: TDD Exception For Branch Integration

**Context**: The production work being integrated was already developed on a
separate branch. This pass is merge, conflict resolution, and verification.

**Decision**: Treat this change as a TDD exception unless conflict resolution
requires new production logic. If new production logic is needed, add or update
the smallest relevant failing test first.

**Consequences**: The integration pass still requires full lint, typecheck,
unit, E2E, build, and CDC gate evidence before completion.

## Data Model Changes

None expected.

## API Changes

None expected.

## Rollout And Rollback

- Rollout: push the integration branch for review.
- Rollback: abandon the integration branch or revert the merge commit.

## Observability

Verification uses local command output, CDC gate output, build output, and the
final git diff/stat.

## Risks And Mitigations

| Risk | Probability | Impact | Mitigation |
|---|---|---|---|
| Merge conflicts accidentally drop a page change | M | H | Inspect conflicts and run route-level tests/build. |
| Combined branches introduce hidden route regressions | M | H | Run full unit, E2E, typecheck, lint, and build. |
| Calculator detail branch omits later SEO changes | L | M | Merge from current cumulative stack into integration branch, not the reverse. |
