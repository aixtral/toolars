# AI Provider Adapter

## Requirement R1: Provider-Neutral Generation Contract

### Description

AI repurpose code must expose a provider-neutral contract so route handlers,
UI, billing, and persistence do not depend on a specific model provider SDK.

### Scenarios

#### Scenario R1-S1: Route uses adapter interface

**Given** `/api/ai/repurpose` receives a valid request  
**When** production generation is implemented  
**Then** the route calls a provider-neutral service rather than importing a
provider SDK directly.

#### Scenario R1-S2: Preview provider remains testable

**Given** local tests need deterministic outputs  
**When** provider implementation is selected  
**Then** tests can use a fake or preview provider without external network
calls.

## Requirement R2: Streaming And Cancellation

### Description

Production AI generation must support streamed output while preserving a
non-streaming fallback for tests, retries, and batch jobs.

### Scenarios

#### Scenario R2-S1: Streaming output lifecycle

**Given** a Pro user starts AI repurposing  
**When** the provider emits text deltas  
**Then** Toolars can map them into job/output events and update UI state from
`streaming` to `completed`.

#### Scenario R2-S2: User cancellation

**Given** generation is in progress  
**When** the user cancels  
**Then** Toolars aborts the in-flight request when possible and stores a
`canceled` job state.

## Requirement R3: Errors, Retries, Cost, And Usage

### Description

Provider calls must normalize errors and usage so plan enforcement, support,
and cost tracking work across providers.

### Scenarios

#### Scenario R3-S1: Provider error normalization

**Given** a provider call fails because of rate limit, timeout, safety refusal,
or invalid config  
**When** the adapter returns the failure  
**Then** the route receives a normalized error code and user-safe message.

#### Scenario R3-S2: Usage and cost events

**Given** a provider call completes  
**When** the adapter returns the result  
**Then** Toolars can record model, token usage, platform count, latency,
provider request ID, and estimated cost without logging raw private source
content by default.

## Requirement R4: Source-Driven Implementation Plan

### Description

Future implementation must be grounded in official AI SDK and OpenAI docs and
must leave no unchecked provider API assumptions.

### Scenarios

#### Scenario R4-S1: Official docs are linked

**Given** a reviewer reads the adapter design  
**When** they inspect provider choices  
**Then** they can find official source URLs for AI SDK generation/streaming,
AI SDK middleware, OpenAI text generation, OpenAI streaming, and Responses API
behavior.

#### Scenario R4-S2: No production API call in this pass

**Given** this is a design pass  
**When** the branch is verified  
**Then** no package dependency, API key, provider SDK import, or external model
call is added.
