# Proposal: public-commercial-routes-pass

## Business Context

Toolars now exposes public navigation to pricing, sign-in, registration, and
compare routes. `design/DESIGN.md` and the PRD also list about, contact, and
privacy pages as part of the v1 commercial site map.

## Problem Statement

Several routes visible in navigation or product documentation do not yet have
page implementations. This creates broken commercial flows and weakens trust for
visitors evaluating the AI subscription or Pro calculator features.

## Scope

### Included

- Add `/pricing`, `/login`, `/register`, `/compare`, `/about`, `/contact`,
  `/privacy`, and the current English alias `/en` pages.
- Keep pages English-first and consistent with the `design/DESIGN.md` visual
  system.
- Show calculators as free/no-login, and AI/cross-device save/PDF/CSV/batch as
  account or Pro capabilities.
- Add tests and E2E route coverage for these routes.

### Excluded

- No real authentication provider integration.
- No real checkout, subscription mutation, or payment provider call.
- No account-backed compare storage.
- No locale expansion beyond English.

## Business Value

| Metric | Current | Target |
|---|---|---|
| Navigation trust | Some linked routes 404 | All primary commercial links resolve |
| Monetization clarity | Pricing link exists but no page | Pricing explains free calculators and Pro AI features |
| Visitor confidence | Legal/about/contact routes missing | Basic trust routes exist |

## Stakeholders

- Visitors: can inspect pricing, account entry, privacy, and company context.
- Product: can communicate free vs Pro boundaries clearly.
- Engineering: gets route coverage so navigation regressions are caught.
