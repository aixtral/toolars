# tool-card-affordances

## Requirement R1: Tool Cards Contain Commercial Utility Metadata

### Description

Shared tool cards must match the required content model in `design/DESIGN.md`
while remaining crawlable links.

### Scenarios

#### Scenario R1-S1: Standard Tool Card Required Content

**Given** a public tool card is rendered  
**When** a visitor scans the card  
**Then** the card includes an icon tile, title, category label, short
description, badges, estimated time or usage metadata, favorite action, and open
action.

#### Scenario R1-S2: Favorite Action Is Accessible

**Given** a tool card has a favorite action  
**When** keyboard or screen-reader users focus it  
**Then** the control has a descriptive accessible label and visible focus style.

#### Scenario R1-S3: Open Action Is Unambiguous

**Given** a visitor wants to start a tool  
**When** they scan a card  
**Then** the card provides an explicit "Open tool" or "Open AI tool" action in
addition to the card link target.
