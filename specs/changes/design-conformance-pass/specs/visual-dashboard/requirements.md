# visual-dashboard

## Requirement R1: Home Is A Utility Dashboard

### Description

The home page must prioritize tool discovery and repeated utility workflows over
marketing hero composition.

### Scenarios

#### Scenario R1-S1: Search And Trust Are Visible First

**Given** a visitor opens the home page  
**When** the first viewport renders  
**Then** the page shows global tool search, trust badges, and no-signup calculator
messaging before any long-form marketing content.

#### Scenario R1-S2: Repeated Workflows Are Represented

**Given** a visitor scans the first dashboard area  
**When** they look for returning-user actions  
**Then** popular tools, recent tools, favorites, and quick actions are visibly
grouped with clear labels.

#### Scenario R1-S3: Comparison Mode Is Discoverable

**Given** calculators support local saved results and comparison  
**When** a visitor reaches the home dashboard  
**Then** a comparison mode entry point explains anonymous local comparison
without requiring login.

## Requirement R2: Directory Feels Filterable

### Description

The tools directory must make categories, filters, sort, favorites, and recent
tools visible as durable utility controls.

### Scenarios

#### Scenario R2-S1: Filter Controls Are Explicit

**Given** a visitor opens `/tools`  
**When** they scan the top controls  
**Then** they can see category, tool type, pricing, and sort controls.

#### Scenario R2-S2: Quick Access Is Visible

**Given** a visitor uses the directory repeatedly  
**When** they open `/tools`  
**Then** favorites and recently used links are visible without scrolling past the
tool grid.
