# Source Inventory Requirements

## Requirement R1: Source Counts Are Explicit

### Description

Toolars must record current source inventory facts so future migration does not rely on stale counts.

### Scenario R1-S1: VitalCalc count

**Given** the current VitalCalc source at `/Users/stanvl/Documents/dev/ai-repo/aixtral-calm/vitalcalc`
**When** the product docs describe source inventory
**Then** they state that `src/pages/tools` currently contains 86 root tool pages.

### Scenario R1-S2: Aixtral Lab count

**Given** the current Aixtral Lab source at `/Users/stanvl/Documents/dev/ai-repo/aixtral-lab`
**When** the product docs describe source inventory
**Then** they state that `src/lib/tool-config.ts` currently contains 92 configured tools and list the seven source categories.

## Requirement R2: Source UI Is Not Reused

### Description

Toolars uses source projects as inventory and logic references, not as visual implementation sources.

### Scenario R2-S1: UI migration boundary

**Given** a source tool page from VitalCalc or Aixtral Lab
**When** it is migrated into Toolars
**Then** only metadata, pure calculation/scanning logic, tests, and SEO lessons may be reused directly; the UI must be rebuilt from Toolars design tokens and templates.
