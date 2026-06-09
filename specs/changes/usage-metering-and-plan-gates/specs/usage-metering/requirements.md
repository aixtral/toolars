# Usage Metering

## Requirement R1: Usage Counters Are Workspace Monthly State

### Description

Usage counters must be scoped by workspace and calendar month so AI plan limits
are stable across devices and route invocations.

### Scenarios

#### Scenario R1-S1: Current month period is computed

**Given** a request is processed on a known date  
**When** Toolars evaluates usage  
**Then** the usage period starts at the first day of that UTC month and ends at
the first day of the next UTC month.

#### Scenario R1-S2: Empty usage defaults to zero

**Given** a workspace has no usage counter row for the current month  
**When** Toolars reads AI generation usage  
**Then** it treats used generations as zero.

## Requirement R2: Successful AI Generations Consume Usage

### Description

Usage must increment only after a successful AI generation. Validation failures,
auth failures, rate limits, and plan denials must not consume quota.

### Scenarios

#### Scenario R2-S1: Successful generation increments

**Given** a Pro workspace is under its monthly limit  
**When** AI generation completes successfully  
**Then** `ai_generations_used` increments by one for that workspace period.

#### Scenario R2-S2: Plan denial does not increment

**Given** a Free workspace requests AI generation  
**When** Toolars returns a plan denial  
**Then** the usage counter is unchanged.

## Requirement R3: Plan Gates Use Durable Usage

### Description

AI plan checks must use the usage repository snapshot instead of the preview
runtime generation counter.

### Scenarios

#### Scenario R3-S1: Limit reached returns payment required

**Given** a Pro workspace has already used all monthly AI generations  
**When** it requests another generation  
**Then** Toolars returns HTTP 402 with the plan limit reason.

#### Scenario R3-S2: Remaining usage is returned

**Given** a successful Pro generation completes  
**When** the route returns usage metadata  
**Then** remaining generations reflect the updated usage count.

## Requirement R4: Usage Writes Are Server-Only

### Description

Usage writes must live behind server route/service modules and must not be
imported by public calculator paths.

### Scenarios

#### Scenario R4-S1: Supabase usage adapter is server only

**Given** the Supabase usage adapter exists  
**When** its source is inspected  
**Then** it imports `server-only` and uses the Supabase service client path.

#### Scenario R4-S2: Public calculators stay independent

**Given** public calculator code is scanned  
**When** usage metering exists  
**Then** public calculator source has no auth, billing, usage, Supabase, or AI
runtime dependency.
