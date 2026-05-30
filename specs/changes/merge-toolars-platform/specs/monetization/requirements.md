# Monetization Requirements

## Requirement M1: Free Calculator Boundary

### Description

Free calculator usage must not be blocked by account or subscription prompts.

### Scenarios

#### Scenario M1-S1: Free result

**Given** an anonymous visitor completes a calculator form  
**When** the calculation succeeds  
**Then** the result is visible without payment or login.

#### Scenario M1-S2: Upgrade prompt is non-blocking

**Given** a result is visible  
**When** the page displays Pro export or sync prompts  
**Then** those prompts do not obscure or remove the free result.

## Requirement M2: Subscription-Gated AI

### Description

AI tools are monetized through subscription tiers.

### Scenarios

#### Scenario M2-S1: Plan enforcement

**Given** a user has a free or limited plan  
**When** they exceed AI usage or platform limits  
**Then** the app blocks the paid action and shows the appropriate upgrade path.

#### Scenario M2-S2: Pro capabilities

**Given** a Pro user  
**When** they use cross-device save, advanced export, or batch tools  
**Then** those capabilities are available according to plan rules.

