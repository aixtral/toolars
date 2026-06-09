# Dependency Audit

## Requirement R1: Audit Findings Are Reproducible

### Description

The dependency audit pass must record the command and advisory that triggered
remediation.

### Scenarios

#### Scenario R1-S1: Audit baseline identifies advisory

**Given** the site dependencies are installed  
**When** `pnpm audit --registry=https://registry.npmjs.org --json` is run  
**Then** the current baseline identifies `GHSA-qx2v-qp2m-jg93` through
`next > postcss@8.4.31`.

## Requirement R2: Vulnerable PostCSS Is Removed From The Lockfile

### Description

PostCSS versions below the advisory's patched version must not remain in the
site lockfile.

### Scenarios

#### Scenario R2-S1: Lockfile guard fails on vulnerable PostCSS

**Given** `site/pnpm-lock.yaml` contains `postcss@8.4.31`  
**When** the dependency security test runs  
**Then** it fails with a message referencing `GHSA-qx2v-qp2m-jg93`.

#### Scenario R2-S2: Lockfile guard passes with patched PostCSS

**Given** the lockfile resolves PostCSS to `>=8.5.10`  
**When** the dependency security test runs  
**Then** it passes.

## Requirement R3: Remediation Uses Documented Package-Manager Controls

### Description

The fix must use a pnpm-supported override rather than hand-editing
`node_modules` or patching vendored dependency code.

### Scenarios

#### Scenario R3-S1: Override is visible in project config

**Given** reviewers inspect dependency configuration  
**When** they open the pnpm configuration  
**Then** they can see a source-linked override for PostCSS.

## Requirement R4: Status Docs Reflect The Current Stack

### Description

The current status document must not lag behind recently opened backend PRs.

### Scenarios

#### Scenario R4-S1: Branch stack includes #10-#15

**Given** a reviewer opens the current status plan  
**When** they inspect the branch stack and immediate next changes  
**Then** production env, security logging, auth DB, AI provider, billing DB,
and usage-metering work are represented.
