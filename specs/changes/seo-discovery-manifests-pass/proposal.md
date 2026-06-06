# Proposal: seo-discovery-manifests-pass

## Business Context

Toolars now has public discovery pages, 73 calculator pages, blog content, AI
directory pages, and commercial trust routes. Search engines and generative
answer engines need a clean machine-readable discovery layer for these surfaces.

## Problem Statement

The site currently has crawlable pages and canonical metadata, but no
`sitemap.xml`, no `robots.txt`, and no concise `llms.txt` style index. This
weakens SEO/GEO discovery and makes it easier for public routes to drift from
the actual generated route set.

## Scope

### Included

- Add deterministic sitemap generation for public, indexable routes.
- Add robots policy that allows public pages and disallows account/API surfaces.
- Add `llms.txt` route summarizing toolars, key routes, calculator inventory, AI
  subscription boundary, and content policy.
- Add unit and E2E tests for the discovery manifests.

### Excluded

- No dynamic CMS sitemap source.
- No locale expansion beyond English-first routes.
- No paid crawler analytics or third-party SEO service integration.

## Business Value

| Metric | Current | Target |
|---|---|---|
| SEO discovery | Page-level metadata only | Sitemap and robots expose public route map |
| GEO readiness | No concise machine-readable site summary | `llms.txt` gives AI systems structured context |
| Route drift | Manual route awareness | Tests verify generated public route coverage |

## Stakeholders

- Search visitors: more reliable discovery of calculators and content pages.
- Product: clearer public vs account-gated boundaries.
- Engineering: test-backed manifest generation as routes expand.
