# Proposal: ai-runtime-security-pass

## Summary

Harden `POST /api/ai/repurpose` with runtime security controls before real AI
provider integration:

- cap request body size
- validate malformed payloads without throwing
- cap `sourceValue` length
- de-duplicate selected platforms before generation and plan-gate evaluation
- track preview usage/rate state server-side for the current process

This addresses the actionable local portion of H2 from
`docs/security/SECURITY-AUDIT-RELEASE-GATE.md`.

## Why

The current route parses JSON directly, trusts request shape after a TypeScript
cast, evaluates plan access with `usedGenerations: 0`, and has no request size
or rate boundary. That is tolerable for static preview, but unsafe as an AI
provider seam.

## Scope

In scope:

- Add tests for oversized request body, malformed payloads, duplicate platform
  normalization, and preview usage/rate enforcement.
- Add pure AI request normalization helpers.
- Add route-level request body reader with maximum size.
- Add in-memory preview runtime guard for usage and burst limits.
- Keep public calculator routes untouched.

Out of scope:

- Real Supabase session lookup.
- Persistent usage counters.
- AI provider SDK integration.
- Billing subscription state.
- Distributed rate limiting.

## TDD

Production code changes are required. Add failing tests first, verify RED, then
implement the smallest route/helper changes to make them pass.

