# Proposal: security-audit-release-gate

## Summary

Run a release-gate security audit for the current Toolars integration candidate.
The audit focuses on preview auth, AI API routes, billing webhook behavior,
secrets handling, dependency supply chain, and the calculator/public-page
boundary.

This is a documentation-only audit pass. It must not change production code.

## Why

Toolars now has a runnable public site and preview SaaS routes, but real auth,
database persistence, AI provider integration, and billing subscription state
are still productionization work. Before W2 implementation proceeds, the project
needs a source-code-backed security baseline that separates current release
blockers from acceptable preview boundaries.

## Scope

In scope:

- Current `site/app/api/**` route handlers.
- Preview auth helpers and app route access behavior.
- Billing webhook helper and route behavior.
- AI repurpose route and client request shape.
- Plan-gate behavior for free/pro/team usage.
- Secret and token archaeology in tracked source.
- Dependency supply-chain audit from `site/pnpm-lock.yaml`.
- Public calculator boundary checks.

Out of scope:

- Implementing Supabase Auth/Postgres.
- Implementing Lemon Squeezy production webhooks.
- Implementing AI provider adapters.
- Fixing findings unless a separate implementation pass is approved.
- Merging or releasing to production.

## TDD Exception

Documentation-only security audit pass. No production code changes are planned.

