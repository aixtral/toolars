# Proposal: auth-route-guard-implementation

## Summary

Add a unified server-side guard for Toolars AI app routes under `/app/**`.
The first implementation uses Next.js 16 `proxy.ts` to block anonymous access
before app pages render, while preserving non-production preview review through
the existing `preview` query/session model.

This fixes the first High finding from
`docs/security/SECURITY-AUDIT-RELEASE-GATE.md`: app routes are not consistently
protected by a server-side auth guard.

## Why

Only `/app/repurpose` currently checks preview session state. Other app pages
render account, history, analytics, billing, API key, and workspace-management
surfaces without a shared guard. That is acceptable as static preview UI, but
it is unsafe as a production backend seam.

## Scope

In scope:

- Add tested `/app/**` proxy guard.
- Redirect anonymous app page requests to `/login?next=<path>`.
- Preserve public routes, calculator routes, API routes, and discovery routes.
- Preserve non-production preview UX by allowing a valid `preview` query or
  preview session cookie for app pages.
- Keep preview sessions disabled in production unless the existing explicit
  preview flag is enabled.

Out of scope:

- Real Supabase/Auth provider integration.
- Persistent user/session database schema.
- AI usage metering or provider integration.
- Billing webhook productionization.

## TDD

Production code changes are required. This change must add failing tests before
adding `site/proxy.ts` and related guard code.

