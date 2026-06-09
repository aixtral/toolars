# Billing Subscription DB Adapter

## Requirement R1: Subscription Events Are Durable And Idempotent

### Description

Provider event records must be written to Supabase before subscription state is
mutated. Duplicate provider event IDs must short-circuit without producing a
second mutation.

### Scenarios

#### Scenario R1-S1: First provider event is inserted

**Given** a valid Lemon Squeezy subscription event  
**When** the billing repository records the provider event  
**Then** a `subscription_events` row is inserted with provider, event id,
workspace id, payload hash, processing status, and timestamps.

#### Scenario R1-S2: Duplicate provider event is detected

**Given** a provider event id already exists  
**When** the same event is processed again  
**Then** the repository reports `duplicate: true` and returns the existing
event record.

## Requirement R2: Subscription State Is Workspace Scoped

### Description

Current subscription state must be stored by provider subscription id and
workspace id so plan access can be evaluated for authenticated AI workflows.

### Scenarios

#### Scenario R2-S1: Subscription is upserted

**Given** a processed provider event maps to a paid plan  
**When** the billing service upserts subscription state  
**Then** a `subscriptions` row stores provider ids, plan id, provider status,
access state, portal URLs, and the last provider event id.

#### Scenario R2-S2: Subscription can be loaded by provider id

**Given** the provider sends a duplicate event  
**When** duplicate handling needs current plan state  
**Then** the repository can load the existing subscription by provider
subscription id.

## Requirement R3: Billing Writes Are Server-Only

### Description

Supabase billing writes must use the server-only service client path and must
not be reachable from public calculator modules or browser components.

### Scenarios

#### Scenario R3-S1: Adapter is server only

**Given** the billing Supabase adapter module is imported  
**When** the module loads  
**Then** it imports `server-only` and creates clients only from the service
Supabase helper.

#### Scenario R3-S2: Calculators remain isolated

**Given** public calculator code is scanned  
**When** billing DB adapter code exists  
**Then** no public calculator source imports billing, Supabase, auth, or AI
runtime modules.

## Requirement R4: Webhook Runtime Can Use DB Or Preview Repository

### Description

The webhook route must remain deterministic in tests while production can use a
Supabase-backed repository when billing DB env is configured.

### Scenarios

#### Scenario R4-S1: Production runtime creates DB repository

**Given** Supabase public and service env are configured  
**When** the webhook route handles a signed subscription event  
**Then** it processes the event through the Supabase billing repository.

#### Scenario R4-S2: Test runtime can inject repository

**Given** a route test injects an in-memory repository  
**When** it posts a signed webhook event  
**Then** the route response remains deterministic and no external DB call is
made.
