# Usage Summary

## Requirement R1: Pure Usage Summary

### Description

The app shall expose a pure usage summary builder that converts a user's plan and current-period usage snapshot into customer-facing limit, used, and remaining values.

### Scenarios

#### Scenario R1-S1: Pro usage summary

**Given** a Pro user has used 17 AI generations, 3 exports, and 2 batch runs in the current period
**When** the app builds a usage summary
**Then** the result includes Pro limits and remaining values for all three meters

#### Scenario R1-S2: Overage is capped at zero remaining

**Given** a usage snapshot exceeds one or more plan limits
**When** the app builds a usage summary
**Then** remaining values are never negative

## Requirement R2: Authenticated Summary API

### Description

The app shall provide a read-only usage summary API for authenticated app users.

### Scenarios

#### Scenario R2-S1: Missing session is rejected

**Given** a request does not have a valid session
**When** it calls `GET /api/usage/summary`
**Then** the API returns 401 and records a usage security event

#### Scenario R2-S2: Authenticated user receives current-period summary

**Given** an authenticated Pro user has an existing usage snapshot
**When** it calls `GET /api/usage/summary`
**Then** the API returns the current-period usage summary without incrementing any counters

## Requirement R3: Billing UI Usage Visibility

### Description

The billing plan card shall render the same usage summary fields as the API so users can see the current-period quota state in the app.

### Scenarios

#### Scenario R3-S1: Pro card shows all usage meters

**Given** the app has a usage summary for a Pro session
**When** `/app/repurpose` renders the billing plan card
**Then** the card shows remaining AI generations, exports, and batch runs for the current period

## Requirement R4: Public Calculator Isolation

### Description

Public calculator routes shall remain free, crawlable, and isolated from account, billing, and usage implementation details.

### Scenarios

#### Scenario R4-S1: Calculator imports remain isolated

**Given** the customer usage summary feature is implemented
**When** calculator isolation tests run
**Then** public calculator modules do not import usage, billing, auth, or account modules
