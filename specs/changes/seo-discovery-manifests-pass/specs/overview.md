# Specs Overview: seo-discovery-manifests-pass

## Capabilities

- `sitemap-discovery`: sitemap includes public indexable routes, 73
  calculators, blog articles, categories, and commercial trust pages.
- `robots-policy`: robots allow public discovery while disallowing API and app
  account surfaces.
- `llms-index`: `llms.txt` summarizes the product, route map, monetization
  boundary, calculator inventory, and AI workflow scope.

## Shared Acceptance

- Account-gated AI app pages, API routes, login, and register are not included
  in the indexable sitemap.
- Public calculators remain discoverable and free/no-login.
- Manifest routes return HTTP 200 in E2E.
- Manifest generation is deterministic and testable without network calls.
