# AI Provider Adapter

## Requirement R1: Provider-Neutral Generation Service

### Description

AI repurpose generation must be orchestrated through a Toolars service and
provider-neutral adapter contract rather than direct route imports of provider
SDKs.

### Scenarios

#### Scenario R1-S1: Route calls Toolars service

**Given** `/api/ai/repurpose` receives a valid authenticated request  
**When** generation is allowed by plan and runtime guards  
**Then** the route calls a Toolars AI generation service and receives a
provider-neutral `RepurposeJob`.

#### Scenario R1-S2: Preview provider stays deterministic

**Given** local tests or preview mode run without provider API keys  
**When** the preview provider is selected  
**Then** generation returns deterministic output cards with provider metadata
and no external network call.

## Requirement R2: AI SDK Adapter Boundary

### Description

The first production provider wrapper should use AI SDK `generateText` behind a
server-only adapter with test injection, not provider SDK imports in UI or
public calculator code.

### Scenarios

#### Scenario R2-S1: AI SDK executor is injectable

**Given** tests run without external provider credentials  
**When** the AI SDK adapter is exercised  
**Then** a fake executor can return model text, token usage, provider request
ID, and finish reason without network.

#### Scenario R2-S2: Provider SDK is server-only

**Given** import-boundary tests scan client components, public calculator paths,
and route handlers  
**When** AI SDK dependencies are installed  
**Then** only server-side provider modules import `ai` package APIs.

## Requirement R3: Error And Usage Metadata

### Description

Provider results must expose usage/latency metadata and normalize provider
errors into user-safe Toolars error codes.

### Scenarios

#### Scenario R3-S1: Usage metadata is returned

**Given** a provider call completes  
**When** Toolars builds the repurpose response  
**Then** it includes provider ID, model, latency, token usage, and optional
provider request ID without logging raw source content.

#### Scenario R3-S2: Provider failures are normalized

**Given** a provider call fails because of rate limit, timeout, refusal, or
invalid config  
**When** the adapter catches the error  
**Then** it returns a normalized `AiProviderError` with a safe message and no
secret or raw prompt content.

## Requirement R4: Configured Provider Selection

### Description

Toolars must select `preview` by default for tests/local demos and fail closed
when a production provider is requested without required configuration.

### Scenarios

#### Scenario R4-S1: Preview remains the default

**Given** no AI provider env vars are set  
**When** provider config is read in development or tests  
**Then** Toolars selects the preview provider.

#### Scenario R4-S2: AI SDK provider requires a model

**Given** `TOOLARS_AI_PROVIDER=ai-sdk`  
**When** provider config is read  
**Then** `TOOLARS_AI_DEFAULT_MODEL` is required before the AI SDK adapter can
run.
