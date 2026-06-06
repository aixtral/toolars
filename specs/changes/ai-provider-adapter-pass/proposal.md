# Proposal: ai-provider-adapter-pass

## Business Context

Toolars AI SaaS pages currently use deterministic preview generation. W2
requires a production-capable AI provider adapter before real repurpose
generation, streaming, usage metering, cost tracking, and retries can be
implemented safely.

## Problem Statement

The current `site/lib/ai` module mixes request validation, preview output
creation, and job shape definitions. If a real provider is added directly into
the route handler, provider-specific code can leak into UI, billing, usage
gates, or test fixtures. The project needs an explicit adapter boundary first.

## Scope

### Included

- Define the AI provider adapter architecture for Toolars.
- Define source-backed choices around AI SDK `generateText`/`streamText` and
  OpenAI Responses API behavior.
- Define streaming, cancellation, errors, retries, telemetry, usage, and cost
  accounting requirements.
- Define migration steps from deterministic preview generation to production
  provider-backed generation.

### Excluded

- No AI SDK, OpenAI SDK, or provider package installation.
- No real API key usage or network calls.
- No replacement of the current preview generator in this pass.
- No database persistence implementation.
- No billing usage mutation implementation.

## Business Value

| Metric | Current | Target |
|---|---|---|
| AI generation | deterministic preview only | adapter contract ready for provider implementation |
| Streaming | UI-simulated stream | source-backed streaming design |
| Provider coupling | route can grow provider-specific logic | route depends on provider-neutral service |
| Cost/usage | preview counters | future metering and audit events designed |

## Affected Stakeholders

- Users: future AI generation should stream reliably and fail gracefully.
- Engineering: provider implementation becomes testable and replaceable.
- Finance/ops: future usage and cost records can support plan limits.
- Security: API keys and model calls stay server-only.
