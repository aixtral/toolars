# Calculator Quality

## Requirement R1: Every Calculator Has Formula Risk Metadata

### Description

All 73 approved calculator slugs must have explicit quality metadata so future
work can prioritize high-impact formulas before lower-risk utility tools.

### Scenarios

#### Scenario R1-S1: Complete risk classification

**Given** the approved calculator inventory contains 73 slugs  
**When** the calculator quality registry is loaded  
**Then** every approved slug has exactly one risk classification.

#### Scenario R1-S2: High-risk categories are discoverable

**Given** a calculator is classified as high risk  
**When** tests inspect its quality metadata  
**Then** the metadata explains the domain and why a golden fixture is required.

## Requirement R2: High-Risk Calculators Have Source-Backed Golden Fixtures

### Description

High-risk calculators covered in this pass must be verified against stable
golden cases with source URLs, expected primary outputs, and expected secondary
values where formula correctness depends on thresholds or derived values.

### Scenarios

#### Scenario R2-S1: Golden fixture minimum

**Given** a calculator is classified as high risk in this pass  
**When** tests collect golden fixtures for that slug  
**Then** at least two source-backed golden cases exist.

#### Scenario R2-S2: Golden cases execute against pure engines

**Given** a source-backed golden case  
**When** the pure calculator engine runs with that case's inputs  
**Then** the primary value and required secondary outputs match the fixture.

## Requirement R3: Unsafe Outputs Are Rejected

### Description

High-impact formulas must not return misleading `NaN`, infinite, or impossible
success states when inputs cannot produce a meaningful result.

### Scenarios

#### Scenario R3-S1: Debt payoff cannot amortize

**Given** a debt payoff input where the monthly payment does not cover monthly
interest  
**When** the calculator runs  
**Then** it returns a validation failure instead of a numeric-looking success.

#### Scenario R3-S2: Health thresholds match source-backed categories

**Given** BMI and blood pressure inputs at source-backed boundary cases  
**When** the calculators run  
**Then** the category labels match the cited public health thresholds.
