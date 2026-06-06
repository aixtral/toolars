# Billing Subscription State

## Requirement R1: Lemon Squeezy Events Are Source-Backed

### Description

The design must use official Lemon Squeezy webhook/event/status documentation,
not preview payload assumptions.

### Scenarios

#### Scenario R1-S1: Webhook signature source is documented

**Given** a billing webhook request arrives  
**When** implementation work starts  
**Then** the signature header and HMAC verification behavior are sourced from
official Lemon Squeezy docs.

#### Scenario R1-S2: Subscription events are mapped

**Given** Lemon Squeezy emits subscription lifecycle events  
**When** the design maps events to Toolars state  
**Then** `subscription_created`, `subscription_updated`,
`subscription_cancelled`, `subscription_resumed`, `subscription_expired`,
payment events, and plan changes are accounted for.

## Requirement R2: Subscription State Is Idempotent

### Description

Provider events can be retried or resent. Toolars must store and process events
idempotently before mutating subscription state.

### Scenarios

#### Scenario R2-S1: Duplicate provider event is ignored

**Given** the same provider event ID is delivered twice  
**When** the webhook handler processes the second event  
**Then** it records no duplicate subscription mutation.

#### Scenario R2-S2: Event history remains auditable

**Given** a subscription changes status  
**When** the provider event is accepted  
**Then** Toolars stores enough event metadata for support and replay analysis.

## Requirement R3: Plan Access Mapping Is Explicit

### Description

Provider subscription status must map to Toolars plan access in a way that
preserves paid-user grace periods and blocks expired/unpaid access.

### Scenarios

#### Scenario R3-S1: Active paid access

**Given** a subscription is active or trialing  
**When** Toolars evaluates AI access  
**Then** the workspace can use the mapped paid plan within usage limits.

#### Scenario R3-S2: Expired paid access

**Given** a subscription is expired or fully unpaid  
**When** Toolars evaluates AI access  
**Then** the workspace falls back to free access.

## Requirement R4: Service Boundary Is Server-Only

### Description

Billing state mutation must be server-only. Client components and public
calculator paths must never write subscription state or hold provider secrets.

### Scenarios

#### Scenario R4-S1: Webhook writes are service-only

**Given** a provider webhook is valid  
**When** Toolars mutates `subscriptions` or `subscription_events`  
**Then** the write happens through a server-only route/service role path.

#### Scenario R4-S2: Calculators remain free

**Given** an anonymous visitor uses a basic calculator  
**When** no account or subscription exists  
**Then** billing state is not required for calculation.
