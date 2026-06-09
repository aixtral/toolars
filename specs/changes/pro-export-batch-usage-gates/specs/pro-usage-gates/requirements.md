# Pro Usage Gates

## Requirement R1: Export Plan Enforcement

### Description

PDF and CSV exports are Pro capabilities. They must require an authenticated
workspace session, a plan with the matching feature, and available monthly
export quota.

### Scenarios

#### Scenario R1-S1: Free Plan Export Denied

**Given** an authenticated workspace on the Free plan  
**When** the workspace requests a PDF or CSV export  
**Then** the route returns `402` with an upgrade label  
**And** usage counters are not incremented.

#### Scenario R1-S2: Pro Export Counted

**Given** an authenticated workspace on the Pro plan under its export limit  
**When** the workspace requests a PDF or CSV export  
**Then** the route returns a successful export payload  
**And** monthly `exports_used` increments exactly once.

#### Scenario R1-S3: Export Limit Denied

**Given** an authenticated workspace on a paid plan at its monthly export limit  
**When** the workspace requests another export  
**Then** the route returns `402`  
**And** usage counters are not incremented.

## Requirement R2: Batch Tool Plan Enforcement

### Description

Batch tools are Pro capabilities. They must require an authenticated workspace
session, a plan with `batch.tools`, and available monthly batch-run quota.

### Scenarios

#### Scenario R2-S1: Free Plan Batch Denied

**Given** an authenticated workspace on the Free plan  
**When** the workspace requests a batch tool run  
**Then** the route returns `402` with an upgrade label  
**And** `batch_runs_used` is not incremented.

#### Scenario R2-S2: Paid Batch Counted

**Given** an authenticated workspace on the Pro or Team plan under its batch
limit  
**When** the workspace requests a batch tool run  
**Then** the route returns a successful batch payload  
**And** monthly `batch_runs_used` increments exactly once.

## Requirement R3: Public Calculator Boundary

### Description

Public calculator pages and pure calculator engines must remain free and must
not import account, billing, usage, or AI runtime modules.

### Scenarios

#### Scenario R3-S1: Calculator Import Isolation Preserved

**Given** premium export and batch API routes exist  
**When** the public calculator import isolation test runs  
**Then** calculator pages and calculator engines still have no forbidden
premium dependencies.
