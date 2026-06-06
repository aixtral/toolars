# Proposal: release-shell-polish-pass

## Business Context

Toolars now has the integrated public, calculator, AI, commercial, and SEO
route stack. The remaining release-shell gap is basic site completeness:
users and crawlers should have a consistent footer and a branded 404 recovery
page instead of the framework default.

## Problem Statement

The root layout currently renders the header and page content only. The design
inventory and PRD both include `/404`, and commercial trust routes exist without
a persistent footer that links users back to tools, AI, pricing, contact, and
privacy surfaces.

## Scope

### Included

- Add a responsive, border-first site footer under the global layout.
- Add a custom App Router `not-found.tsx` page.
- Add component tests for footer links and the 404 recovery page.
- Add E2E coverage for footer crawlability and unknown-route recovery.

### Excluded

- No terms page unless approved in a later pass.
- No locale-specific footer copy beyond English-first links.
- No CMS, analytics, auth, billing, or database work.

## Business Value

| Area | Before | Target |
|---|---|---|
| Navigation recovery | Default framework 404 | Branded recovery to tools/search/app surfaces |
| Trust routes | Reachable mostly through header/content | Persistent footer exposes commercial/legal links |
| SEO/GEO | Public routes exist | Site shell gives crawlers consistent route clusters |

## Stakeholders

- Search visitors landing on outdated or mistyped calculator URLs.
- Commercial users checking pricing, contact, privacy, and AI boundaries.
- Engineering reviewers validating design checklist closure for footer and 404.
