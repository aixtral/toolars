# Proposal: ai-saas-pages-design-pass

## Business Context

Toolars now has a unified public tools surface and an upgraded AI repurpose
workspace. The adjacent AI SaaS pages still need the same commercial density
and interaction clarity so the app feels like one paid product, not a set of
placeholder pages.

## Problem Statement

The template library, brand voice manager, history, analytics, and settings
pages expose the required concepts, but they do not yet present enough workflow
context, side panels, page actions, or dense enterprise-style controls from
`design/DESIGN.md`.

## Scope

### Included

- Upgrade `/app/templates`, `/app/brand-voice`, `/app/history`,
  `/app/analytics`, and `/app/settings`.
- Keep the existing app shell and route structure.
- Add commercial page regions, filters, summary panels, and action affordances.
- Keep copy English-first and preview-safe.
- Add component/page tests and E2E coverage for the improved structure.

### Excluded

- No real database-backed history sync.
- No real template execution beyond current preview actions.
- No real billing provider or account management integration.
- No changes to calculator pages or public discovery pages.

## Business Value

| Metric | Current | Target |
|---|---|---|
| SaaS page polish | Basic panels | Cohesive paid workspace pages |
| Paid feature clarity | Scattered labels | Explicit plan, limits, actions, and workflow state |
| Design conformance | Partial | AI support pages follow `design/DESIGN.md` page specs |

## Stakeholders

- Users: understand templates, voices, history, analytics, and settings as one
  coherent Pro workflow.
- Product: stronger subscription framing without gating free calculators.
- Engineering: reusable page patterns for future account-backed integration.
