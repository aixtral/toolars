# Security Event Logging

## Requirement R1: AI Failure Paths Emit Safe Events

### Description

AI route failures must record structured security events without source text or
raw request payloads.

### Scenarios

#### Scenario R1-S1: Missing AI session is logged

**Given** an unauthenticated request posts to `/api/ai/repurpose`  
**When** the route returns `401`  
**Then** a security event records route, category, reason, status, and request
ID.

#### Scenario R1-S2: Plan denial is logged without source text

**Given** a free preview user posts source text to `/api/ai/repurpose`  
**When** the route returns a plan-denial response  
**Then** a security event records plan and selected platform count but not the
AI source text.

## Requirement R2: Billing Failure Paths Emit Safe Events

### Description

Billing webhook failures must record structured security events without provider
secrets, signatures, or raw webhook payloads.

### Scenarios

#### Scenario R2-S1: Invalid signature is logged

**Given** a billing webhook request has no valid `X-Signature`  
**When** the route returns `401`  
**Then** a security event records route, category, reason, event name when
available, status, and request ID.

#### Scenario R2-S2: Unsupported billing payload is logged without raw body

**Given** a signed billing webhook has an unsupported payload  
**When** the route returns `400`  
**Then** a security event records event name and status but not the raw JSON
payload or signature.

## Requirement R3: Events Are Structured And Bounded

### Description

The logger must keep metadata small and safe for future external log sinks.

### Scenarios

#### Scenario R3-S1: Event metadata is allowlisted

**Given** a route records a security event  
**When** the event is stored or emitted  
**Then** metadata only includes primitive safe values from an explicit
allowlist.

#### Scenario R3-S2: Request IDs are generated when missing

**Given** an API request does not include `x-request-id`  
**When** a security event is recorded  
**Then** the event has a generated request ID.
