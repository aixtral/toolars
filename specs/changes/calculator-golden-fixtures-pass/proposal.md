# Proposal: calculator-golden-fixtures-pass

## Business Context

Toolars now has 73 public calculator routes and pure TypeScript formula engines.
The next production-hardening step is to improve formula confidence for
health and finance calculators before the site is positioned as a trustworthy
commercial utility product.

## Problem Statement

The current calculator suite proves route coverage and has representative
formula tests, but it does not yet classify formula risk or require
source-backed golden values for high-impact calculators. That leaves health
screening thresholds, finance amortization math, and unsafe edge cases too easy
to regress during future migration work.

## Scope

### Included

- Add a calculator quality module that classifies all 73 calculators by formula
  risk.
- Add source-backed golden fixtures for the first high-risk health and finance
  representative set.
- Add tests that require every high-risk calculator in this pass to have at
  least two golden cases.
- Fix any formula/category defects exposed by the new golden tests.
- Keep calculator engines pure and independent from React, browser APIs,
  network, auth, billing, and AI modules.

### Excluded

- No UI redesign.
- No account-backed persistence, exports, or Pro features.
- No real medical, tax, investment, or lending advice workflow.
- No full source audit for every medium-risk calculator in this pass.

## Business Value

| Metric | Current | Target |
|---|---|---|
| Calculator inventory coverage | 73 routes and engines | 73 routes and engines plus risk classification |
| High-risk golden fixtures | Representative ad hoc tests | Source-backed fixture harness and first high-risk set |
| Edge-case protection | Basic positive-number validation | Explicit unsafe-output regression coverage |
| Reviewability | Formula assertions embedded in one test file | Reusable fixture data with source URLs and rationale |

## Affected Stakeholders

- Users: get more reliable calculator outputs and clearer safety behavior.
- SEO/GEO: high-trust calculator pages are better positioned for search and AI
  retrieval surfaces.
- Engineering: future calculator migrations inherit a stable golden-test
  harness instead of one-off assertions.
