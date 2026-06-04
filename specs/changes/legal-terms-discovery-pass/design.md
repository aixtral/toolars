# Design: legal-terms-discovery-pass

## Architecture

Add a static App Router page and wire it into existing route discovery:

```text
site/app/terms/page.tsx
site/app/__tests__/commercial-pages.test.tsx
site/components/layout/footer.tsx
site/components/layout/__tests__/footer.test.tsx
site/lib/seo/index.ts
site/lib/seo/__tests__/metadata.test.ts
site/e2e/public-pages.spec.ts
site/e2e/seo.spec.ts
```

## ADR-1: Terms Is A Public Trust Route

**Context**: Toolars calculators are free, AI tools are account/subscription
gated, and Pro exports/batch tools are paid boundaries.

**Decision**: Add `/terms` as a public, indexable static route with clear
English-first sections for acceptable use, calculators, AI tools, exports,
account context, and contact.

**Consequences**: The route becomes crawlable and linked from the footer. It is
not a substitute for final legal review.

## ADR-2: Discovery Manifests Must Stay Route-Aware

**Context**: Sitemap and `llms.txt` are generated from local route arrays.

**Decision**: Add `/terms` to public sitemap routes and `llms.txt` trust links.

**Consequences**: SEO/GEO discovery reflects the new legal page, and tests guard
against future route drift.

## Data Model Changes

None.

## API Changes

None.

## Rollout And Rollback

- Rollout: ship static route, footer link, manifest update, tests.
- Rollback: revert the page, footer link, and SEO helper changes.

## Observability

Verification through Vitest component/SEO tests, Playwright public route and
manifest E2E checks, build output, and browser smoke.

## Risks And Mitigations

| Risk | Probability | Impact | Mitigation |
|---|---|---|---|
| Terms copy reads like final legal advice | M | M | Label it as product terms draft and keep language operational. |
| Sitemap route count drifts | M | M | Update deterministic tests with exact route count. |
| Footer legal links crowd mobile layout | L | M | Use compact stacked footer groups already tested at 390px. |
