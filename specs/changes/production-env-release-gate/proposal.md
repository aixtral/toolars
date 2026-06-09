# Proposal: production-env-release-gate

## Business Context

Toolars still uses preview query/header auth while the real Supabase/Auth
backend is pending. Preview auth is useful locally, but it must never be
enabled in production.

## Problem Statement

The current auth helper allows `TOOLARS_ENABLE_PREVIEW_AUTH=true` to re-enable
preview sessions even when `NODE_ENV=production`. A single deployment
misconfiguration could let users self-select a paid preview plan.

## Scope

### Included

- Add a production env release gate that fails if preview auth is enabled in
  production.
- Wire the release gate into `next.config.ts` so production builds catch the
  misconfiguration early.
- Update auth preview-session logic so production never trusts preview query or
  header sessions.
- Add focused tests for the release gate and updated auth behavior.
- Document the env requirement in this change spec.

### Excluded

- Real Supabase/Auth provider implementation.
- CI provider-specific workflow configuration.
- Runtime secret manager integration.

## Business Value

| Metric | Current | Target |
|---|---|---|
| H4 risk | Production can re-enable preview auth with one env flag | Production build/config fails on preview auth flag |
| Preview auth policy | Mixed prod/non-prod behavior | Explicit non-production-only policy |
| Release confidence | Manual env review only | Testable release gate |

## Stakeholders

- Users: paid access cannot be self-selected through preview params in
  production.
- Engineering: preview auth remains available locally without ambiguous prod
  behavior.
- Release/security: H4 is closed before public production launch.
