# Proposal: design-conformance-pass

## Business Context

The merged toolars platform is functionally in place, but the first visual
implementation still reads more like a simple MVP surface than the commercial
utility dashboard described in `design/DESIGN.md`.

The next increment should tighten design conformance without changing product
scope, calculator formulas, auth behavior, or billing rules.

## Problem Statement

The current UI uses the correct token family, radius, and border-first baseline,
but several required commercial UX details are underrepresented:

- Home should feel like an immediately usable tool discovery dashboard, not a
  large marketing card followed by sections.
- Tool cards need the full commercial utility affordances from `DESIGN.md`:
  icon tile, badges, usage/time metadata, favorite action, and clear open action.
- Directory pages need visible quick-access and filter framing that feels
  deliberate rather than placeholder-like.
- Visual QA needs explicit evidence from browser screenshots and E2E tests.

## Scope

### Included

- First-pass home/dashboard layout refinement against `design/DESIGN.md`.
- Shared tool card affordance upgrade.
- Tools directory filter/quick-access polish.
- Representative browser visual QA for mobile-sized and desktop routes.
- Tests that lock the new visible UX contracts.

### Not Included

- No new calculators or formula changes.
- No auth provider, database, or billing provider integration.
- No full PNG-to-pixel-perfect implementation for every page.
- No phase-two locale migration.
- No external production deployment.

## Business Value

| Metric | Current | Target |
|---|---|---|
| Homepage first impression | MVP functional | Commercial utility dashboard |
| Tool card affordances | Partial | Matches required card content |
| Design evidence | E2E behavior only | E2E + visual audit notes |
| Scope safety | Broad visual ambition | Small, testable first pass |

## Stakeholders

- Users: faster tool discovery, clearer no-login calculator affordances.
- Product: more commercial visual quality aligned to source-of-truth design.
- Engineering: reusable card and layout contracts that can scale across 73 tools.
