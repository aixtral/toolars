# Security Release Gate

## Requirement R1: Audit Coverage Is Code-Backed

### Description

The audit must inspect current source files and route handlers rather than only
restating architecture intentions.

### Scenarios

#### Scenario R1-S1: Auth and app access are reviewed

**Given** preview auth exists in the current integration candidate  
**When** the audit report is written  
**Then** it identifies how preview sessions are accepted or rejected and whether
production behavior fails closed.

#### Scenario R1-S2: AI and billing API routes are reviewed

**Given** Toolars exposes AI and billing route handlers  
**When** the audit report is written  
**Then** it reviews unauthenticated access, plan enforcement, webhook signature
checks, and replay/idempotency boundaries.

## Requirement R2: Findings Are Release-Gate Actionable

### Description

The report must use severity bands and state whether the current candidate is
blocked for production release.

### Scenarios

#### Scenario R2-S1: Findings have anchors

**Given** a finding is reported  
**When** a reviewer reads the audit  
**Then** the finding includes a file:line or dependency/version anchor and a
specific remediation path.

#### Scenario R2-S2: Release decision is explicit

**Given** critical or high findings exist  
**When** the audit report summarizes release readiness  
**Then** the report states whether production release is blocked and why.

## Requirement R3: Verification Evidence Is Recorded

### Description

The audit must record reproducible commands for source scanning, dependency
audit, CDC gates, and report checks.

### Scenarios

#### Scenario R3-S1: Secret and dependency scans are recorded

**Given** the audit checks tracked source and dependencies  
**When** verification completes  
**Then** evidence records the command and result for secret/token grep and
dependency audit.

#### Scenario R3-S2: CDC gate is recorded

**Given** the audit pass is ready for review  
**When** CDC verification runs  
**Then** evidence records `cdc-workflow gate` and `ship-preview` results.

