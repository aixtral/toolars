# Public Tool Platform Requirements

## Requirement T1: All 73 Calculators Are In Scope

### Description

All 73 calculators from the approved inventory must exist as v1 routes and be
discoverable.

### Scenarios

#### Scenario T1-S1: Calculator routes exist

**Given** the v1 site is built  
**When** the route inventory is checked  
**Then** each approved calculator slug has a public route.

#### Scenario T1-S2: Calculator is discoverable

**Given** any approved calculator  
**When** a user searches by name or browses its category  
**Then** they can open the calculator.

## Requirement T2: Calculators Are Free Without Login

### Description

Basic calculator use must remain free and anonymous.

### Scenarios

#### Scenario T2-S1: Anonymous calculation

**Given** an unauthenticated visitor opens a calculator  
**When** they enter valid values and submit  
**Then** the result is shown without requiring login.

#### Scenario T2-S2: Account prompt is contextual

**Given** an unauthenticated visitor uses a calculator  
**When** they choose cross-device save or Pro export  
**Then** the site may prompt for login/upgrade without blocking the basic result.

## Requirement T3: Calculator Logic Is Testable

### Description

Formula logic must be pure TypeScript and separately tested.

### Scenarios

#### Scenario T3-S1: Pure formula module

**Given** a calculator formula is implemented  
**When** it is imported into a unit test  
**Then** it runs without React, DOM, network, auth, or browser storage.

#### Scenario T3-S2: Invalid input is handled

**Given** invalid or out-of-range input  
**When** the calculator validates values  
**Then** it returns specific validation errors and does not produce misleading
results.

