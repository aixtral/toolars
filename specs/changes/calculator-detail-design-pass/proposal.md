# Proposal: calculator-detail-design-pass

## Business Context

Toolars v1 now has the merged Next.js App Router foundation and a more
commercial home/directory surface. The next highest-leverage screen is the
shared calculator detail page because all 73 public calculators depend on the
same template.

`design/DESIGN.md` requires calculator pages to feel like precise utility
workspaces: inputs above the fold, results adjacent to the form on desktop,
plain-English formula explanation, related tools, FAQ/schema, and save/compare/
share affordances.

## Problem Statement

The current calculator detail implementation is functional, but it does not yet
fully express the commercial high-fidelity layout described in the design
source of truth:

- The title area needs explicit favorite/share utility actions.
- The form/result workspace needs stronger two-column framing on desktop.
- Post-result education should be organized into breakdown, formula, related
  tools, FAQ, and non-interruptive monetization/ad surfaces.
- Tests should lock these contracts so future calculator migrations inherit the
  same UX.

## Scope

### Included

- CDC spec for the calculator detail design pass.
- Component/page tests for calculator detail template UX contracts.
- Shared calculator workspace layout refinement under `site/`.
- Representative browser visual QA for at least one calculator detail route.
- Verification via lint, typecheck, tests, E2E, and CDC gate.

### Not Included

- No formula changes.
- No new calculator inventory beyond the existing 73 definitions.
- No account/database/billing integration.
- No PDF/CSV export implementation.
- No phase-two locale migration.

## Business Value

| Metric | Current | Target |
|---|---|---|
| Calculator page fidelity | Functional template | Commercial utility workspace |
| 73-page consistency | Dependent on shared shell | Locked by shared tests |
| SEO/GEO readiness | Basic crawlable route | FAQ/formula/related sections visible |
| Monetization safety | Placeholder-level | Ad/pro affordances do not interrupt form/result |

## Stakeholders

- Users: clearer calculation flow and trustworthy result interpretation.
- Product: consistent public utility pages that can rank and convert.
- Engineering: reusable calculator page contract before deeper formula migration.
