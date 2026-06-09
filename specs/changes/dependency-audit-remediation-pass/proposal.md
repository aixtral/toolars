# Proposal: dependency-audit-remediation-pass

## Business Context

Toolars W2 now has real auth, AI provider, billing DB, and usage-metering seams.
Before integrating the stack toward main, dependency security findings need a
small remediation pass with reproducible evidence.

## Problem Statement

`pnpm audit --registry=https://registry.npmjs.org --json` reports one moderate
advisory: `GHSA-qx2v-qp2m-jg93`, where `next@16.2.6` pulls
`postcss@8.4.31`. Next 16.2.7 still declares the same PostCSS dependency, so a
direct Next patch upgrade does not remove the finding.

## Scope

### Included

- Add a pnpm override that forces vulnerable `postcss` transitive usage to a
  patched version.
- Add a lockfile regression test that fails when vulnerable PostCSS versions
  return.
- Re-run audit, lint, type-check, unit tests, build, and CDC gate.
- Refresh current status documentation so it reflects PR #10-#15 progress.

### Not Included

- Broad latest-version upgrades unrelated to the current advisory.
- Major upgrades for Node, TypeScript, ESLint, or React.
- Replacing Next.js or waiting for an upstream Next release.

## Business Value

| Metric | Current | Target |
|---|---|---|
| Moderate npm audit findings | 1 | 0 |
| Vulnerable transitive PostCSS | `8.4.31` via Next | `>=8.5.10` |
| Current status doc | stale at #9 | updated through #15 |

## Stakeholders

- Users: reduced XSS exposure in CSS serialization paths.
- Engineering: dependency remediation is documented and test-guarded.
- Release reviewers: W2 stack has a cleaner security baseline before main
  integration.
