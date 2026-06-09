# Stack Integration

## Requirement R1: Integration Branch Is A Clean Top-Stack Branch

### Description

The integration branch must be based on the latest verified top-stack branch and
must not introduce unrelated implementation changes.

### Scenarios

#### Scenario R1-S1: Main is an ancestor

**Given** the integration branch is created  
**When** git ancestry is checked  
**Then** `origin/main` is an ancestor of the branch head.

#### Scenario R1-S2: Worktree is clean before PR

**Given** verification is complete  
**When** `git status -sb` and `git diff --stat` are checked  
**Then** the worktree is clean.

## Requirement R2: CDC Context Reflects The Current Stack

### Description

CDC context and architecture docs must describe the latest stack through
dependency remediation so future agents do not use stale productionization
boundaries.

### Scenarios

#### Scenario R2-S1: Context names top stack

**Given** a future agent opens `.cdc/CONTEXT.md`  
**When** they inspect current implementation facts  
**Then** they see Auth/DB, AI provider, billing DB, usage metering, and
dependency remediation status.

#### Scenario R2-S2: Architecture names backend adapters

**Given** a reviewer opens `.cdc/ARCHITECTURE.md`  
**When** they inspect module boundaries  
**Then** they see Supabase, billing, usage, AI provider, and public-calculator
dependency isolation boundaries.

## Requirement R3: Verification Covers The Top Stack

### Description

The integration branch must run the standard top-stack verification commands
before a PR is created.

### Scenarios

#### Scenario R3-S1: Unit and build gates pass

**Given** dependencies are installed  
**When** lint, type-check, unit tests, build, audit, and CDC gate are run  
**Then** all commands exit successfully.

#### Scenario R3-S2: E2E smoke passes

**Given** the site is run through Playwright  
**When** `pnpm --dir site test:e2e` is executed  
**Then** the public, calculator, auth/billing, AI, and SEO smoke tests pass.

## Requirement R4: Integration PR Is Draft And Reviewable

### Description

The integration PR must be a draft PR targeting `main`, with body text that
summarizes scope, verification, and remaining release blockers.

### Scenarios

#### Scenario R4-S1: PR targets main

**Given** the branch is pushed  
**When** the PR is created  
**Then** its base is `main`, head is `feat/integrate-latest-stack-to-main`, and
draft is true.
