# Proposal: legal-terms-discovery-pass

## Business Context

Toolars now has commercial pages, privacy, footer navigation, SEO manifests,
and a branded 404 page. The design spec calls for terms and privacy links, but
the release-shell pass intentionally excluded a Terms page.

## Problem Statement

The footer and public discovery layer expose privacy but not Terms. This leaves
a common commercial trust route missing and makes the legal surface feel
unfinished for subscription-gated AI workflows.

## Scope

### Included

- Add an English-first `/terms` page.
- Add Terms to the footer legal/trust links.
- Include `/terms` in sitemap and `llms.txt` discovery output.
- Add unit and E2E coverage for the page and discovery manifests.

### Excluded

- No lawyer-reviewed final legal language.
- No checkbox acceptance flow, account settings acceptance log, or billing
  provider terms integration.
- No non-English legal content migration.

## Business Value

| Area | Before | Target |
|---|---|---|
| Commercial trust | Privacy route only | Privacy and Terms are both reachable |
| SEO/GEO discovery | Terms absent from manifests | Terms appears in sitemap and `llms.txt` |
| Subscription readiness | AI Pro boundary documented across pages | Terms clarify free calculators and account-gated AI boundaries |

## Stakeholders

- Visitors evaluating whether Toolars is a credible commercial product.
- Future subscribers who need plan, export, acceptable use, and AI boundaries.
- Engineering reviewers checking design/legal route completeness.
