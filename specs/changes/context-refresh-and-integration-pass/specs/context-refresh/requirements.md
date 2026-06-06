# Context Refresh

## Requirement R1: CDC Context Matches Current Implementation

### Description
The CDC context must describe the actual repository state after the latest stacked feature branch.

### Scenarios

#### Scenario R1-S1: Current state is implementation-aware
**Given** an engineer reads `.cdc/CONTEXT.md`  
**When** they review the repository facts and verification baseline  
**Then** they see the current Next.js implementation, route coverage, branch stack, and preview/production boundaries.

## Requirement R2: Architecture Matches Current Modules

### Description
The CDC architecture file must describe the current `site/` module map and identify open architecture decisions.

### Scenarios

#### Scenario R2-S1: Architecture is not stale
**Given** an engineer reads `.cdc/ARCHITECTURE.md`  
**When** they review current repository shape and module boundaries  
**Then** it names the actual `site/app`, `site/components`, `site/data`, and `site/lib` structure.

## Requirement R3: Iteration Plan Is Explicit

### Description
The docs folder must contain a concise current-state and iteration plan.

### Scenarios

#### Scenario R3-S1: Next execution waves are clear
**Given** the product owner asks what to do next  
**When** they open the status/iteration plan  
**Then** they see W0 integration, W1 calculator hardening, W2 SaaS backend, and W3 release readiness priorities.
