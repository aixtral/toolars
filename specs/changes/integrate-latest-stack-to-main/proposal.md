# Proposal: integrate-latest-stack-to-main

## Business Context

Toolars now has a long stacked draft PR chain through W2 backend
productionization and dependency audit remediation. The next coordination step
is to create a single top-stack integration review branch that can be compared
against `main` and used as the review anchor for advancing the latest work.

## Problem Statement

`main` still represents the earlier design-conformance baseline while the
current implementation lives across stacked draft PRs. CDC context files also
lag behind the latest backend and dependency work, which can mislead future
agents and reviewers.

## Scope

### Included

- Create `feat/integrate-latest-stack-to-main` from the current top-stack
  branch.
- Refresh `.cdc/CONTEXT.md`, `.cdc/ARCHITECTURE.md`, and current status docs to
  identify the top stack through PR #16.
- Run full verification on the top-stack integration branch.
- Create a draft integration PR to `main` for review.

### Not Included

- Directly merging to `main`.
- Marking stacked PRs ready for review.
- New product/backend features.
- Resolving follow-up release work such as AI persistence, checkout portal UI,
  production credentials, or final security audit.

## Business Value

| Metric | Current | Target |
|---|---|---|
| Review anchor | Many stacked draft PRs | One top-stack integration PR to `main` |
| CDC context freshness | Stale in `.cdc` files | Current through dependency remediation |
| Integration confidence | Per-branch evidence | Top-stack full verification evidence |

## Stakeholders

- Reviewers: can see the complete diff from `main` to the current stack.
- Engineering: future CDC work starts from current project facts.
- Product: release-readiness gaps remain explicitly visible after integration.
