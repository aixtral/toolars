# Design: public-commercial-routes-pass

## Architecture

This change adds static Next.js App Router pages under `site/app/`:

```text
site/app/pricing/page.tsx
site/app/login/page.tsx
site/app/register/page.tsx
site/app/compare/page.tsx
site/app/about/page.tsx
site/app/contact/page.tsx
site/app/privacy/page.tsx
site/app/en/page.tsx
```

Tests live in:

```text
site/app/__tests__/commercial-pages.test.tsx
site/e2e/public-pages.spec.ts
```

## ADR-1: Static Commercial Shells

**Context**: The routes are required for navigation and trust, but real auth and
billing provider work belongs to separate integration specs.

**Decision**: Implement deterministic static shells with real forms/buttons
marked as preview-safe UI only.

**Consequences**: Visitors no longer hit 404s, while backend side effects stay
out of scope.

## ADR-2: Clear Monetization Boundary

**Context**: The product decision is calculators free/no-login, AI subscription,
and Pro for sync/export/batch.

**Decision**: Pricing and compare pages explicitly repeat this boundary.

**Consequences**: Conversion copy stays aligned with product decisions and SEO
pages do not accidentally gate calculators.

## ADR-3: Trust Pages Use Same Design System

**Context**: About/contact/privacy pages often become generic afterthoughts.

**Decision**: Use the same card, badge, typography, and border-first hierarchy
as the rest of the site.

**Consequences**: The trust pages feel like part of toolars without adding a
separate marketing layout system.

## Data Model Changes

None.

## API Changes

None.

## Rollout And Rollback

- Rollout: add static routes to the Next.js app.
- Rollback: revert this change; existing navigation links would return to 404.

## Observability

No runtime metrics are added. Verification uses unit tests, E2E, build, and
route HTTP smoke checks.

## Risks And Mitigations

| Risk | Probability | Impact | Mitigation |
|---|---|---|---|
| Users mistake preview auth forms for working auth | M | M | Use clear account preview copy and no backend calls. |
| Pricing overpromises Pro exports | M | M | Phrase Pro export/sync/batch as product capabilities, not active checkout. |
| Static trust copy becomes stale | L | M | Keep copy concise and policy-oriented. |
