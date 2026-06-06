# Design: release-shell-polish-pass

## Architecture

Add a presentational footer component to the existing layout module and render
it once in the root App Router layout:

```text
site/components/layout/footer.tsx
site/components/layout/index.ts
site/app/layout.tsx
site/app/not-found.tsx
site/components/layout/__tests__/footer.test.tsx
site/app/__tests__/not-found.test.tsx
site/e2e/release-shell.spec.ts
```

## ADR-1: Footer Belongs To Root Layout

**Context**: Public pages and app preview pages share the same global header.
Users need consistent access to primary public surfaces, trust routes, and
commercial/legal links.

**Decision**: Render `Footer` in `site/app/layout.tsx` below page content.

**Consequences**: Every route gets a crawlable footer. The footer must stay
quiet, compact, and border-first so it does not compete with utility workflows.

## ADR-2: 404 Recovery Uses Product IA, Not Marketing Copy

**Context**: Toolars is a utility site; recovery should direct users back to
search, tools, AI, and pricing rather than presenting a generic landing hero.

**Decision**: Build `site/app/not-found.tsx` with direct links to `/tools`,
`/ai`, `/pricing`, `/contact`, and the homepage.

**Consequences**: Unknown routes preserve brand trust and improve user recovery
without introducing new product claims.

## Data Model Changes

None.

## API Changes

None.

## Rollout And Rollback

- Rollout: ship static component/page additions with the existing Next.js app.
- Rollback: revert the footer component, root layout import, not-found page, and
  tests.

## Observability

Verification through Vitest component tests, Playwright E2E tests, full build,
and browser smoke on `/does-not-exist`.

## Risks And Mitigations

| Risk | Probability | Impact | Mitigation |
|---|---|---|---|
| Footer creates mobile horizontal overflow | M | H | E2E viewport check at 390px. |
| Footer overpowers utility pages | M | M | Use compact text/link groups and border-first hierarchy. |
| 404 looks like a marketing hero | L | M | Use recovery links and route clusters, not oversized sales copy. |
