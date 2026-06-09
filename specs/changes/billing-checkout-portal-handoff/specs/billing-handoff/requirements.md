# Billing Handoff

## Requirement R1: Authenticated Checkout Redirect

### Description

Checkout handoff must require an authenticated Toolars workspace session and
must build a safe provider checkout URL for the requested paid plan.

### Scenarios

#### Scenario R1-S1: Missing Session Denied

**Given** a request without a Toolars session  
**When** the user requests checkout  
**Then** the route returns `401`  
**And** no provider URL is exposed.

#### Scenario R1-S2: Missing Checkout Config Fails Closed

**Given** an authenticated workspace session  
**When** the requested plan has no configured checkout URL  
**Then** the route returns `503` with a safe error.

#### Scenario R1-S3: Paid Checkout Redirect Decorates Workspace Context

**Given** an authenticated workspace session and configured Pro checkout URL  
**When** the user requests Pro checkout  
**Then** the route returns `303`  
**And** the redirect URL includes `checkout[custom][workspace_id]`,
`checkout[custom][user_id]`, and `checkout[email]`.

## Requirement R2: Customer Portal Redirect

### Description

Customer portal handoff must require an authenticated workspace session and
prefer a signed portal URL stored on the workspace subscription.

### Scenarios

#### Scenario R2-S1: Signed Portal URL Redirect

**Given** an authenticated paid workspace with a stored `customerPortalUrl`  
**When** the user requests the billing portal  
**Then** the route returns `303` to the signed portal URL.

#### Scenario R2-S2: Unsigned Portal Fallback

**Given** an authenticated workspace without a signed portal URL  
**And** a configured store billing portal URL  
**When** the user requests the billing portal  
**Then** the route returns `303` to the configured unsigned portal URL.

#### Scenario R2-S3: Missing Portal Target Fails Closed

**Given** an authenticated workspace without subscription portal data  
**And** no configured unsigned portal URL  
**When** the user requests the billing portal  
**Then** the route returns `404` without exposing provider internals.

## Requirement R3: Public Calculator Boundary

### Description

Billing handoff routes must not introduce billing dependencies into public
calculator pages or calculator engines.

### Scenarios

#### Scenario R3-S1: Calculator Import Isolation Preserved

**Given** billing checkout and portal routes exist  
**When** public calculator import isolation runs  
**Then** public calculator modules still have no forbidden billing, auth, DB,
usage, or AI imports.
