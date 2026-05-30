# Design System Requirements

## Requirement D1: DESIGN.md Source Of Truth

### Description

`design/DESIGN.md` is the canonical v1 design source for tokens, components,
interactions, accessibility, and page structure.

### Scenarios

#### Scenario D1-S1: Component implementation follows tokens

**Given** an engineer implements a component  
**When** they choose colors, spacing, radius, typography, or icon treatment  
**Then** they use values from `design/DESIGN.md`.

#### Scenario D1-S2: Missing PNG does not block shared template work

**Given** a calculator lacks an individual generated PNG  
**When** the calculator uses the shared detail template  
**Then** implementation follows `design/DESIGN.md` and the representative PNGs
as visual reference.

## Requirement D2: Search-First Utility UX

### Description

toolars must prioritize immediate tool discovery over marketing exposition.

### Scenarios

#### Scenario D2-S1: Home first screen is functional

**Given** a visitor opens the home page  
**When** the first viewport renders  
**Then** global search, tool categories, popular/recent/favorite areas, and AI
entry are visible or immediately reachable.

#### Scenario D2-S2: No marketing-only hero

**Given** the home page is reviewed  
**When** the top section is evaluated  
**Then** it is not a decorative hero with only a value proposition and CTA.

## Requirement D3: Accessibility Baseline

### Description

All UI must meet WCAG 2.1 AA and keyboard interaction requirements.

### Scenarios

#### Scenario D3-S1: Command palette works by keyboard

**Given** a keyboard-only user  
**When** they press Cmd/Ctrl+K  
**Then** search opens, focuses input, allows arrow navigation, Enter activation,
and Esc close.

#### Scenario D3-S2: Mobile targets are usable

**Given** the UI is rendered at 390px width  
**When** interactive elements are inspected  
**Then** primary tap targets are at least 44px and text does not overflow.

