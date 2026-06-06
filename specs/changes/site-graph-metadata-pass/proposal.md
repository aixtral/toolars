# Proposal: site-graph-metadata-pass

## Business Context

Toolars already exposes public routes, sitemap, robots, and llms.txt for calculator and AI-tool discovery. The remaining gap is site-level entity metadata: crawlers and generative search systems can find pages, but the root layout does not yet identify the website, organization, default Open Graph surface, or search action consistently.

## Problem Statement

The current root layout only declares a minimal title, description, and favicon. This weakens previews, canonical site identity, and GEO grounding for pages that do not override every metadata field.

## Scope

### Included
- Add root-level Next.js metadata defaults for `metadataBase`, title, Open Graph, Twitter card, canonical home URL, and favicon.
- Add reusable `Organization` and `WebSite` JSON-LD helpers with a `SearchAction` target for the public tools directory.
- Render site-level JSON-LD from the root layout.
- Add unit and E2E coverage for the new metadata and schema behavior.

### Not Included
- Dynamic social image generation.
- Analytics, search indexing infrastructure, or external SEO services.
- Changing calculator formulas, AI SaaS flows, pricing, or visual design.

## Business Value

| Metric | Current | Target |
|---|---|---|
| Site entity metadata | Minimal root metadata | Consistent Website + Organization graph |
| Social preview baseline | Page-dependent | Root fallback Open Graph and Twitter card |
| GEO grounding | Sitemap/llms only | Sitemap/llms plus JSON-LD site identity |

## Stakeholders

- Users: receive clearer previews when sharing toolars links.
- Search engines and AI answer engines: can associate public pages with the same site entity and search surface.
- Engineering: gets typed, reusable SEO helpers instead of route-local duplication.
