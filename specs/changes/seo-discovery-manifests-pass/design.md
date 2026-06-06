# Design: seo-discovery-manifests-pass

## Architecture

Add pure manifest builders in the SEO library, then expose them through Next.js
App Router metadata routes:

```text
site/lib/seo/index.ts
site/lib/seo/__tests__/metadata.test.ts
site/app/sitemap.ts
site/app/robots.ts
site/app/llms.txt/route.ts
site/e2e/seo.spec.ts
```

## ADR-1: Deterministic Manifest Builders

**Context**: Sitemap and `llms.txt` should not depend on runtime crawling or a
remote CMS.

**Decision**: Generate manifests from local registries: tools, calculators,
blog articles, and fixed public route arrays.

**Consequences**: Tests can assert exact coverage, and build output stays stable.

## ADR-2: Account And API Surfaces Are Not Indexable

**Context**: AI generation, history, settings, billing webhooks, and app pages
are account/API surfaces.

**Decision**: Robots disallow `/app/` and `/api/`, and sitemap excludes login,
register, app, and API routes.

**Consequences**: Public discovery stays focused on calculators, content,
pricing, compare, and trust pages.

## ADR-3: `llms.txt` Is Informational, Not Prompt Authority

**Context**: GEO benefits from a concise site summary, but the file should not
act as an instruction override.

**Decision**: The file describes product scope, route groups, and privacy/paid
boundaries only.

**Consequences**: It improves machine readability while avoiding unsafe prompt
style instructions.

## Data Model Changes

None.

## API Changes

New public routes:

- `/sitemap.xml`
- `/robots.txt`
- `/llms.txt`

## Rollout And Rollback

- Rollout: ship static metadata routes with existing Next.js app.
- Rollback: revert route files and helper additions.

## Observability

Verification through unit tests, E2E route checks, build output, and HTTP smoke.

## Risks And Mitigations

| Risk | Probability | Impact | Mitigation |
|---|---|---|---|
| Sitemap includes noindex/account routes | M | M | Tests assert excluded paths. |
| Route count drifts as tools change | M | M | Generate from registries, not hand-written tool list. |
| `llms.txt` overstates feature readiness | M | M | Describe current product boundaries clearly. |
