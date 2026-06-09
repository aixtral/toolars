# Security Release Gate Requirements

## Requirement R1: Consolidated Security Audit Report

### Description

The top-stack branch must have a single security audit report that reviewers can
use for release readiness decisions.

### Scenarios

#### Scenario R1-S1: Report includes severity sections
**Given** the audit has completed  
**When** a reviewer opens the report  
**Then** it includes Critical, High, Medium, Low, and accepted-risk or no-finding sections.

#### Scenario R1-S2: Report includes go/no-go decision
**Given** all findings have been classified  
**When** the report is finalized  
**Then** it states whether PR #17 is blocked from release and lists required follow-up changes.

## Requirement R2: Auth, AI, Billing, And Database Threat Review

### Description

Security-sensitive Toolars flows must be evaluated across OWASP Top 10 and
STRIDE categories.

### Scenarios

#### Scenario R2-S1: Auth and session boundaries are reviewed
**Given** the current branch includes `/app/**` guarding and Supabase helpers  
**When** the audit runs  
**Then** the report evaluates preview auth, production fail-closed behavior,
session resolution, service-role boundaries, and public route isolation.

#### Scenario R2-S2: AI route and usage gates are reviewed
**Given** the current branch includes AI generation, provider adapters, request
limits, and usage metering  
**When** the audit runs  
**Then** the report evaluates input limits, plan gates, usage increments,
provider selection, logging, and failure modes.

#### Scenario R2-S3: Billing webhook boundaries are reviewed
**Given** the current branch includes Lemon Squeezy webhook parsing,
signature validation, idempotency, and subscription persistence  
**When** the audit runs  
**Then** the report evaluates replay protection, malformed payload handling,
event storage, subscription updates, and logging.

#### Scenario R2-S4: SQL and RLS posture is reviewed
**Given** the current branch includes Supabase migrations  
**When** the audit runs  
**Then** the report evaluates RLS enablement, grants, authenticated access,
service-role writes, and workspace scoping.

## Requirement R3: Dependency And Secrets Evidence

### Description

The release audit must include command evidence for dependency vulnerabilities
and secret/token archaeology.

### Scenarios

#### Scenario R3-S1: Dependency audit is recorded
**Given** the current lockfile and package graph  
**When** dependency audit commands run  
**Then** the report records the command, result, and any known vulnerability
follow-up.

#### Scenario R3-S2: Secret archaeology is recorded
**Given** the current branch and git history  
**When** secret search commands run  
**Then** the report records whether any secrets, tokens, API keys, passwords,
or private keys were found and how false positives were handled.

## Requirement R4: Evidence And Follow-up

### Description

The audit must be verifiable and produce actionable next steps.

### Scenarios

#### Scenario R4-S1: CDC evidence ledger is updated
**Given** verification commands have run  
**When** the change is closed  
**Then** `.cdc/state/evidence.jsonl` and `.cdc/state/closeouts.jsonl` contain
entries for this change.

#### Scenario R4-S2: Follow-up changes are named
**Given** the audit finds non-blocking work  
**When** the report is finalized  
**Then** follow-up CDC change IDs or roadmap items are named.
