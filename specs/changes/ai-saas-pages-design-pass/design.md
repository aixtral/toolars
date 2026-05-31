# Design: ai-saas-pages-design-pass

## Architecture

This change keeps the current Next.js App Router structure and upgrades only
server-rendered page components plus their tests.

```text
site/app/app/templates/page.tsx
site/app/app/brand-voice/page.tsx
site/app/app/history/page.tsx
site/app/app/analytics/page.tsx
site/app/app/settings/page.tsx
site/app/app/__tests__/ai-pages.test.tsx
site/e2e/ai-navigation.spec.ts
```

The pages continue to render static preview data. They should communicate the
shape of the paid workflow while preserving a clean boundary from real auth,
billing, AI provider, and persistence integrations.

## ADR-1: Page-Level Commercial Regions

**Context**: `design/DESIGN.md` asks AI app pages to include dense controls,
workflow state, and relevant actions.

**Decision**: Add semantic page regions such as "Template workspace",
"Voice governance", "History operations", "Analytics cockpit", and "Settings
operations". Each region has visible copy, compact controls, and action buttons.

**Consequences**: Tests can target stable region names, and future account data
can replace static preview data without changing the page skeleton.

## ADR-2: Static Preview Data Only

**Context**: This pass is about UX/UI conformance, not backend integration.

**Decision**: Keep all content as deterministic static data inside page modules.

**Consequences**: Build and SEO behavior remain predictable. Real persistence,
template execution, and subscription mutations require later specs.

## ADR-3: App Shell Consistency

**Context**: The repurpose workspace now has stronger page-level structure.
Supporting pages should feel related without duplicating the repurpose form.

**Decision**: Use the same token system, cards, badges, compact typography, and
border-first hierarchy already in the app.

**Consequences**: The SaaS area feels cohesive and avoids one-off visual
patterns.

## Data Model Changes

None.

## API Changes

None.

## Rollout And Rollback

- Rollout: static page changes behind existing routes.
- Rollback: revert this branch or affected page files.

## Observability

No runtime metrics are added. Verification uses tests, E2E, build, and visual
browser QA.

## Risks And Mitigations

| Risk | Probability | Impact | Mitigation |
|---|---|---|---|
| Pages overpromise real account features | M | M | Use preview-safe copy and clear plan/status labels. |
| Too much density on mobile | M | M | Use responsive grids and avoid fixed-width overflow. |
| Tests become brittle due to wording | M | L | Assert stable region labels and core controls. |
