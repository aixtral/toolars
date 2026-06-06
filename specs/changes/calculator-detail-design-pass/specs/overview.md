# Specification Overview: calculator-detail-design-pass

This change upgrades the shared calculator detail page into the commercial
utility workspace described in `design/DESIGN.md`.

Capabilities:

- `calculator-detail-workspace`: calculator detail pages use a two-column
  form/result workspace on desktop and form-then-result flow on mobile.
- `calculator-detail-actions`: title and result surfaces expose favorite,
  save/compare, and share affordances without requiring login for the basic
  calculator.
- `calculator-detail-seo`: formula, breakdown, related tools, FAQ, and safe ad
  placeholder sections are visible and ordered for crawlability.
- `calculator-detail-qa`: representative unit, E2E, and browser checks verify
  the template.

Primary source of truth:

- `design/DESIGN.md`

Supporting references:

- `.cdc/ARCHITECTURE.md`
- `.cdc/CONTEXT.md`
- `ui-ux-pro-max` recommendation for restrained enterprise utility UX
