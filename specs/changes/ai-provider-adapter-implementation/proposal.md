# Proposal: ai-provider-adapter-implementation

## Business Context

Toolars now has route-level AI security, production preview-auth gates,
security-event logging, and a Supabase Auth/DB foundation. The next W2 backend
step is to replace the deterministic preview-only AI generation seam with a
production-capable provider adapter boundary.

## Problem Statement

`/api/ai/repurpose` still calls `createRepurposeJob()` directly. That keeps
tests deterministic, but it gives Toolars no provider-neutral abstraction,
model/provider configuration, normalized provider errors, or token/latency
metadata. Wiring a real provider directly into the route would make auth,
usage, billing, and persistence harder to review.

## Scope

### Included

- Add a provider-neutral AI adapter contract and generation service.
- Add a deterministic preview provider that implements the same contract.
- Add an AI SDK provider wrapper behind the adapter, with dependency injection
  for tests so no network call is required.
- Add server-only provider config and env validation.
- Update `/api/ai/repurpose` to call the provider-neutral service.
- Add import-boundary tests proving provider SDKs do not leak into client
  components, public calculator paths, or route handlers.

### Not Included

- Persistent AI jobs, outputs, usage counters, or cost ledger writes.
- Streaming transport to the UI; the route can still return JSON in this pass.
- Real provider API keys in repo or test execution.
- Direct OpenAI Responses adapter; AI SDK is the first production provider
  wrapper.
- Retry/backoff policy beyond normalized error handling.

## Business Value

| Metric | Current | Target |
|---|---|---|
| AI provider boundary | route calls preview generator directly | route calls provider-neutral service |
| Testability | deterministic local generation only | deterministic preview plus fake AI SDK executor |
| Production readiness | no provider config/usage metadata | provider config, latency/tokens, normalized errors |
| Secret safety | no provider dependency | provider imports stay server-only and tested |

## Stakeholders

- Users: AI generation can move toward real provider output without changing
  the app UX.
- Business: future usage metering and subscription gates get provider usage
  metadata.
- Engineering: provider SDK changes stay isolated behind one adapter contract.
