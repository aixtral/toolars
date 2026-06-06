# Proposal: context-refresh-and-integration-pass

## Business Context

Toolars has moved from a design handoff workspace into a runnable Next.js App Router implementation with a stacked set of completed CDC feature branches. The repository-level CDC context and architecture files still describe the project as documentation/spec-only, which can mislead future planning, review, and automation.

## Problem Statement

The current `.cdc/CONTEXT.md` and `.cdc/ARCHITECTURE.md` are stale relative to the actual `site/` application. The project also needs an explicit current-state and iteration plan that separates implemented preview surfaces from production-readiness work.

## Scope

### Included
- Refresh `.cdc/CONTEXT.md` with current implementation facts, latest branch stack, verification baseline, and productionization boundaries.
- Refresh `.cdc/ARCHITECTURE.md` with the actual Next.js module map, current dependency boundaries, and open production architecture work.
- Add a docs-level current status and iteration plan for the next execution waves.
- Keep this change documentation-only.

### Not Included
- No production code changes.
- No main branch merge, PR merge, or release action.
- No Supabase, provider, billing, or observability implementation in this pass.

## Business Value

| Metric | Current | Target |
|---|---|---|
| CDC context accuracy | Says documentation/spec phase | Reflects runnable Next.js implementation |
| Integration readiness | Branch stack known informally | Branch stack and merge readiness documented |
| Iteration planning | Spread across review notes | Clear W0-W3 execution path |

## Stakeholders

- Product owner: gets an accurate implementation snapshot and next-step plan.
- Engineering agents: get correct context before future CDC specs.
- Reviewers: can distinguish preview/MVP surfaces from production-ready systems.
