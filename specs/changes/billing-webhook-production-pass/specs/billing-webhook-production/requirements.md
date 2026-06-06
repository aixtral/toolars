# Billing Webhook Production

## Requirement R1: Lemon Squeezy Signatures Are Verified

### Description

Webhook requests must verify the raw body with the configured signing secret and
the Lemon Squeezy `X-Signature` header.

### Scenarios

#### Scenario R1-S1: Valid Lemon signature is accepted

**Given** a request body signed with the configured billing webhook secret  
**When** `POST /api/billing/webhook` receives `X-Signature` and `X-Event-Name`  
**Then** the route accepts the request and does not require preview headers.

#### Scenario R1-S2: Preview or invalid signature is rejected

**Given** a request is missing `X-Signature` or uses old preview headers only  
**When** the webhook route handles the request  
**Then** it returns `401` without mutating subscription state.

## Requirement R2: Subscription Events Are Parsed From Provider Payloads

### Description

Toolars must parse Lemon Squeezy subscription resource payloads rather than the
old simplified preview body.

### Scenarios

#### Scenario R2-S1: Active subscription maps to Pro access

**Given** a signed `subscription_created` event with a known Pro variant ID and
provider status `active`  
**When** the event is processed  
**Then** Toolars records a Pro subscription with paid access.

#### Scenario R2-S2: Unknown variant does not grant access

**Given** a signed subscription event has an unmapped provider variant ID  
**When** the event is processed  
**Then** the event is recorded as failed/requires review and no paid
subscription mutation occurs.

## Requirement R3: Provider Events Are Idempotent

### Description

Webhook retries and manual replays must not double-mutate subscription state.

### Scenarios

#### Scenario R3-S1: Duplicate provider event returns success

**Given** a provider event ID has already been processed  
**When** the same signed event is delivered again  
**Then** the route returns success with `duplicate: true` and records no extra
subscription mutation.

#### Scenario R3-S2: Event ledger is auditable

**Given** a subscription event is accepted  
**When** the repository stores the event  
**Then** the stored event includes provider, event ID, event name, object ID,
payload hash, processing status, and workspace ID when available.

## Requirement R4: Access Mapping Is Explicit

### Description

Raw provider status must map to Toolars access state without trusting client
plan inputs.

### Scenarios

#### Scenario R4-S1: Expired or unpaid status falls back to free

**Given** a known paid variant arrives with status `expired` or `unpaid`  
**When** the subscription is reconciled  
**Then** Toolars records `free` access.

#### Scenario R4-S2: Cancelled status preserves paid access until end date

**Given** a known paid variant arrives with status `cancelled` and an `ends_at`
date  
**When** the subscription is reconciled  
**Then** Toolars records `paid_until_end` access for the mapped paid plan.
