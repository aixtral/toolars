# Proposal: toolars-v1-design-integration

## Business Context

Toolars has accumulated several design and product implementation passes across
separate feature branches: AI SaaS pages, public commercial routes, SEO
discovery manifests, and calculator detail workspace redesign. The current
working branch includes the AI/public/SEO stack but does not yet include the
calculator detail pass.

## Problem Statement

If the calculator detail redesign remains on a sibling branch, the v1 design
stack is incomplete: public SEO discovery, AI SaaS pages, and commercial routes
would land without the upgraded calculator workspace that anchors the 73 free
tools.

## Scope

### Included

- Create an integration branch from the current cumulative public/AI/SEO stack.
- Merge `origin/feat/calculator-detail-design-pass` into that branch.
- Resolve conflicts while preserving `design/DESIGN.md` as the UX source of
  truth.
- Run full site verification after integration.
- Record CDC evidence and push the integrated branch.

### Excluded

- No new product scope beyond integrating already-built branch work.
- No visual redesign outside the merged calculator detail pass.
- No auth, billing, database, or AI provider implementation changes.

## Business Value

| Area | Before | Target |
|---|---|---|
| v1 design stack | Split across sibling branches | One integrated branch ready for review |
| Calculator UX | At risk of being omitted | Included with the public/AI/SEO stack |
| Release confidence | Branch-local verification only | Full-stack verification on the combined tree |

## Stakeholders

- Search visitors using public calculator pages.
- AI SaaS users moving between app and free tools.
- Engineering reviewers evaluating a single integrated v1 design branch.
